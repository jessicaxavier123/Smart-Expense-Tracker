import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  CircularProgress,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useAuth } from '../src/firebase/auth';
import { addReceipt, updateReceipt } from '../src/firebase/firestore';
import styles from '../styles/expenseDialog.module.scss';

const DEFAULT_FILE_NAME = "No file selected";

// Default form state for the dialog
const DEFAULT = {
  date: null,
  locationName: '',
  address: '',
  items: '',
  amount: '',
  imageUrl: ''
};

/* 
Dialog to input receipt information

props:
- edit is the receipt to edit
- showDialog boolean for whether to show this dialog
- onError emits to notify error occurred
- onSuccess emits to notify successfully saving receipt
- onCloseDialog emits to close dialog
 */
export default function ExpenseDialog({
  edit = {},
  showDialog,
  onCloseDialog,
  onSuccess,
  onError
}) {
  const isEdit = Boolean(edit.id);
  const { authUser } = useAuth();
  const [form, setForm] = useState(DEFAULT);
  const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  if (showDialog) {
    setForm(
      isEdit
        ? { ...DEFAULT, ...edit }
        : DEFAULT
    );
  }
}, [showDialog, edit, isEdit]);


  const handleChange = (field) => (e) =>
    setForm(f => ({ ...f, [field]: e.target.value }));
  const handleDate = (date) =>
    setForm(f => ({ ...f, date }));

  const handleSave = async () => {
    setSubmitting(true);
    try {
      if (isEdit) {
        await updateReceipt(authUser.uid, edit.id, form);
      } else {
        await addReceipt(authUser.uid, form);
      }
      onSuccess();
    } catch (err) {
      onError(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={showDialog} onClose={onCloseDialog}>
      <DialogContent>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Date"
            value={form.date}
            onChange={handleDate}
            renderInput={(params) => (
              <TextField {...params} fullWidth margin="normal" />
            )}
          />
        </LocalizationProvider>

        <TextField
          label="Location"
          value={form.locationName}
          onChange={handleChange('locationName')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          value={form.address}
          onChange={handleChange('address')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Items"
          value={form.items}
          onChange={handleChange('items')}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Amount"
          type="number"
          value={form.amount}
          onChange={handleChange('amount')}
          fullWidth
          margin="normal"
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onCloseDialog} disabled={submitting}>
          Cancel
        </Button>
        {/* SAVE / UPDATE button */}
        <Button 
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={submitting}>
          {submitting
            ? <CircularProgress size={24} />
            : isEdit
              ? 'Save Changes'
              : 'Save Receipt'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

  // Check whether any of the form fields are unedited
