import { Box, IconButton, Paper } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import { useRef } from 'react';

type Props = {
  value: string;
  onChange: (html: string) => void;
};

export const RichTextEditor = ({ value, onChange }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  const exec = (cmd: string) => {
    document.execCommand(cmd);
    if (ref.current) {
      onChange(ref.current.innerHTML);
    }
  };

  return (
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Box mb={1}>
        <IconButton onClick={() => exec('bold')}>
          <FormatBoldIcon />
        </IconButton>
        <IconButton onClick={() => exec('underline')}>
          <FormatUnderlinedIcon />
        </IconButton>
      </Box>

      <Box
        ref={ref}
        contentEditable
        suppressContentEditableWarning
        onInput={() => {
          if (ref.current) onChange(ref.current.innerHTML);
        }}
        dangerouslySetInnerHTML={{ __html: value }}
        sx={{
          minHeight: 100,
          border: '1px solid #ddd',
          borderRadius: 2,
          p: 2
        }}
      />
    </Paper>
  );
};
