import * as React from 'react';
import Masonry from '@mui/lab/Masonry';
import ImageListItem from '@mui/material/ImageListItem';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

interface Item {
  img: string;
  title: string;
}

interface StyleImageListProps {
  itemData: Item[];
  onRemoveImage: (img: string) => void; // ฟังก์ชันสำหรับลบรูปภาพ
}


export default function StyleImageList({ itemData, onRemoveImage }: StyleImageListProps) {
  const [visibleImages, setVisibleImages] = React.useState(4); // จำนวนรูปเริ่มต้น

  const handleShowMore = () => {
    setVisibleImages(itemData.length); // เมื่อกดแสดงทั้งหมด
  };

  return (
    <div style={{ width: '100%', margin: '0 auto' }}>
      <Masonry
        columns={{ xs: 1, sm: 3, md: 4 }}
        spacing={2}
        sx={{ width: '100%' }}
      >
        {itemData.slice(0, visibleImages).map((item) => (
          <ImageListItem key={item.img} sx={{ position: 'relative' }}>
            <img
              src={item.img} // ใช้ URL Blob ตรง ๆ
              alt={item.title}
              loading="lazy"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
                objectFit: 'cover',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
              }}
            />
            {/* ปุ่มกากบาทสำหรับลบรูป */}
            <IconButton
              sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'white', borderRadius: '50%' }}
              onClick={() => onRemoveImage(item.img)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </Masonry>

      {/* ปุ่มดูเพิ่มเติม */}
      {visibleImages < itemData.length && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button variant="contained" onClick={handleShowMore}>
            ...ดูเพิ่มเติม
          </Button>
        </div>
      )}
    </div>
  );
}
