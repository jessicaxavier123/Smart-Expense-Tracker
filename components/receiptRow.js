// components/receiptRow.js
import { useState } from 'react';
import {
    Avatar,
    IconButton,
    Stack,
    Typography,
    Dialog,
    DialogContent
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon   from '@mui/icons-material/Edit';
import { format } from 'date-fns';
import styles     from '../styles/receiptRow.module.scss';

export default function ReceiptRow({ receipt, onEdit, onDelete }) {
  // track whether the preview dialog is open
    const [imgOpen, setImgOpen] = useState(false);

  // clean up the merchant name
    const displayName = receipt.locationName
    .replace(/\s*\([^)]*\)/g, '')
    .trim();

  // optional address
    const addressPart = receipt.address
    ? ` (${receipt.address})`
    : '';

    const dateString = format(receipt.date, 'MM/dd/yy');

    return (
    <>
        <Stack direction="row" justifyContent="space-between" sx={{ my: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {/* Wrap the Avatar in an IconButton */}
            <IconButton onClick={() => setImgOpen(true)} size="small">
            <Avatar alt="receipt image" src={receipt.imageUrl} />
            </IconButton>

            <Stack direction="row" className={styles.contentRow}>
            <Stack direction="column" sx={{ flexGrow: 1 }}>
                <Typography variant="h3">{dateString}</Typography>
                <Typography variant="h4">${receipt.amount}</Typography>
            </Stack>
            <Stack direction="column" sx={{ flexGrow: 1 }}>
                <Typography variant="h5">
                {displayName}{addressPart}
                </Typography>
                <Typography variant="h5">{receipt.items}</Typography>
            </Stack>
            </Stack>
        </Stack>

        <Stack direction="row" className={styles.actions}>
            <IconButton aria-label="edit" color="secondary" onClick={onEdit}>
            <EditIcon />
            </IconButton>
            <IconButton aria-label="delete" color="secondary" onClick={onDelete}>
            <DeleteIcon />
            </IconButton>
        </Stack>
        </Stack>

      {/* Full-image Dialog */}
        <Dialog
        open={imgOpen}
        onClose={() => setImgOpen(false)}
        maxWidth="md"
        fullWidth
        >
        <DialogContent sx={{ p: 0, textAlign: 'center' }}>
            <img
            src={receipt.imageUrl}
            alt="Full receipt"
            style={{ maxWidth: '100%', height: 'auto' }}
            />
        </DialogContent>
        </Dialog>
    </>
    );
}
