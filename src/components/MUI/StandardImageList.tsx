import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { CircularProgress, useMediaQuery } from '@mui/material';

interface Item {
  img: string;
  title: string;
}

interface StyleImageListProps {
  itemData: Item[];
  onRemoveImage: (img: string) => void;
  actions?: string;
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%', // ใช้ความกว้าง 90% สำหรับมือถือ
  height: '80%', // ความสูง 80% ของหน้าจอ
  maxWidth: '700px', // ขนาดสูงสุด 900px
  maxHeight: '700px', // ขนาดสูงสุด 800px
  bgcolor: 'black',
  borderRadius: '8px',
  boxShadow: 24,
  textAlign: 'center',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

export default function StyleImageList({ itemData, onRemoveImage, actions }: StyleImageListProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [imageLoading, setImageLoading] = React.useState(true);

  const handleImageLoad = () => setImageLoading(false);

  const handleOpen = React.useCallback((index: number) => {
    setSelectedIndex(index);
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    setOpen(false);
    setSelectedIndex(null);
  }, []);

  const handlePrevImage = React.useCallback(() => {
    if (selectedIndex !== null && selectedIndex > 0) {
      setImageLoading(true);
      setSelectedIndex(selectedIndex - 1);
    }
  }, [selectedIndex]);

  const handleNextImage = React.useCallback(() => {
    if (selectedIndex !== null && selectedIndex < itemData.length - 1) {
      setImageLoading(true);
      setSelectedIndex(selectedIndex + 1);
    }
  }, [selectedIndex, itemData.length]);

  // ใช้ useMediaQuery เพื่อตรวจสอบขนาดหน้าจอ
  const isLargeScreen = useMediaQuery('(min-width:600px)');
  const isMediumScreen = useMediaQuery('(min-width:700px)');

  return (
    <div
      style={{
        width: '100%',
        margin: '0 auto',
        height: '400px',
        overflowY: 'scroll',
        padding: '10px',
      }}
    >
      <ImageList cols={isLargeScreen ? 4 : isMediumScreen ? 3 : 2} gap={8}>
        {itemData.map((item, index) => (
          <ImageListItem key={item.img} sx={{ position: 'relative' }}>
            <img
              src={item.img}
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
                objectFit: 'cover',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer',
              }}
              onClick={() => handleOpen(index)}
            />
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'white',
                borderRadius: '50%',
                opacity: actions === 'Reade' ? 0 : 1,
                pointerEvents: actions === 'Reade' ? 'none' : 'auto',
              }}
              onClick={() => {
                if (actions !== 'Reade') {
                  onRemoveImage(item.img);
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>

      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedIndex !== null && (
            <>
              {imageLoading && <CircularProgress />}
              <img
                src={itemData[selectedIndex].img}
                alt="Expanded view"
                onLoad={handleImageLoad}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain', // ปรับขนาดให้แสดงภาพทั้งหมด
                  display: imageLoading ? 'none' : 'block',
                }}
              />
              <IconButton
                onClick={handlePrevImage}
                disabled={selectedIndex === 0}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '10px',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                  zIndex: 10,
                }}
              >
                <ArrowBackIosIcon />
              </IconButton>
              <IconButton
                onClick={handleNextImage}
                disabled={selectedIndex === itemData.length - 1}
                sx={{
                  position: 'absolute',
                  top: '50%',
                  right: '10px',
                  transform: 'translateY(-50%)',
                  bgcolor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  borderRadius: '50%',
                  '&:hover': {
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                  },
                  zIndex: 10,
                }}
              >
                <ArrowForwardIosIcon />
              </IconButton>
            </>
          )}
        </Box>
      </Modal>
    </div>
  );
}
