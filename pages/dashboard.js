import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NavBar from '../components/navbar';
import ReceiptRow from '../components/receiptRow';
import ExpenseDialog from '../components/expenseDialog';
import { useAuth } from '../src/firebase/auth';
import { extractReceiptData } from '../components/tesseract';
import {
  fetchReceipts,
  deleteReceipt,
  addReceipt,
  updateReceipt
} from '../src/firebase/firestore';
import {
  Button,
  CircularProgress,
  Typography,
  Container,
  Stack
} from '@mui/material';

export default function Dashboard() {
  const router = useRouter();
  const { authUser, isLoading } = useAuth();

  // Receipt list state
  const [receipts, setReceipts] = useState([]);

  // Dialog state
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingReceipt, setEditingReceipt] = useState({});

  // OCR upload state
  const [ocrInProgress, setOcrInProgress] = useState(false);
  const [ocrError, setOcrError] = useState('');

  // Protect route & load receipts
  const handleFileUpload = async (e) => {
  setOcrError('');
  const file = e.target.files?.[0];
  if (!file) return;

  setOcrInProgress(true);
  try {
    const data = await extractReceiptData(file);

    // 1) create a blob URL for immediate preview
    const objectUrl = URL.createObjectURL(file);

    const docRef = await addReceipt(authUser.uid, {
    ...data,
    imageUrl: objectUrl
  });
  
    // build the new receipt object
    const newReceipt = {
      id:        Date.now().toString(),
      ...data,
      imageUrl:  objectUrl
    };

    // update state *only* with our local blob URL
    setReceipts(prev => [newReceipt, ...prev]);

    // persist to Firestore (but do *not* re-fetch)
    await addReceipt(authUser.uid, newReceipt);
  } catch (err) {
    console.error('OCR error:', err);
    setOcrError(err.message || 'Error processing receipt.');
  } finally {
    setOcrInProgress(false);
  }
};



  // Open edit dialog
  const handleEdit = (receipt) => {
    setEditingReceipt(receipt);
    setDialogOpen(true);
  };

  // Delete receipt
  const handleDelete = async (id) => {
    try {
      await deleteReceipt(authUser.uid, id);
      setReceipts(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  // Dialog callbacks
  const closeDialog = () => {
    setDialogOpen(false);
    setEditingReceipt({});
  };

  const onDialogSuccess = async () => {
    const updated = await fetchReceipts(authUser.uid);
    setReceipts(updated);
    closeDialog();
  };

  const onDialogError = (err) => {
    console.error('Dialog save error:', err);
  };

  if (isLoading || !authUser) return null;

  return (
    <>
      <NavBar />
      {/* Expense add/edit dialog */}
      <ExpenseDialog
        edit={editingReceipt}
        showDialog={dialogOpen}
        onCloseDialog={closeDialog}
        onSuccess={onDialogSuccess}
        onError={onDialogError}
      />

      <Container sx={{ py: 3 }}>
        <Typography variant="h4" gutterBottom>
          Your Receipts
        </Typography>

        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Button variant="contained" component="label" disabled={ocrInProgress}>
            {ocrInProgress ? <CircularProgress size={20} /> : 'Upload Receipt'}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleFileUpload}
            />
          </Button>
          {ocrError && <Typography color="error">{ocrError}</Typography>}
        </Stack>

        {receipts.map(r => (
          <ReceiptRow
            key={r.id}
            receipt={r}
            onEdit={() => handleEdit(r)}
            onDelete={() => handleDelete(r.id)}
          />
        ))}
      </Container>
    </>
  );
}
