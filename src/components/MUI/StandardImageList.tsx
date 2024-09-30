import * as React from 'react';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal'; // นำเข้า Modal
import Box from '@mui/material/Box';

interface Item {
  img: string;
  title: string;
}

interface StyleImageListProps {
  itemData: Item[];
  onRemoveImage: (img: string) => void; // ฟังก์ชันสำหรับลบรูปภาพ
  actions?: string; // เพิ่ม props สำหรับ actions
}

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70%', // ปรับความกว้างของ modal
  maxWidth: '500px', // ปรับความกว้างสูงสุด
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 1, // ปรับ padding ให้เล็กลง
  textAlign: 'center',
};

export default function StyleImageList({ itemData, onRemoveImage, actions }: StyleImageListProps) {
  const [open, setOpen] = React.useState(false); // สเตทสำหรับเปิด modal
  const [selectedImage, setSelectedImage] = React.useState<string | null>(null); // สเตทสำหรับเก็บรูปภาพที่เลือก

  const handleOpen = (img: string) => {
    setSelectedImage(img); // กำหนดรูปภาพที่เลือก
    setOpen(true); // เปิด modal
  };

  const handleClose = () => {
    setOpen(false); // ปิด modal
    setSelectedImage(null); // ลบรูปภาพที่เลือก
  };

  return (
    <div
      className="image-list-container" // ใช้คลาส CSS ที่สร้างขึ้น
      style={{
        width: '100%',
        margin: '0 auto',
        height: '400px', // กำหนดความสูงของ container (สามารถปรับเปลี่ยนได้)
        overflowY: 'scroll', // เพิ่ม Scrollbar แนวตั้ง
        padding: '10px', // เพิ่ม padding สำหรับการเลื่อน
      }}
    >
      <ImageList
        cols={window.innerWidth > 600 ? 4 : window.innerWidth > 700 ? 3 : 2} // ปรับจำนวนคอลัมน์ตามขนาดหน้าจอ   
        gap={8} // ระยะห่างระหว่างรูปภาพ
      >
        {itemData.map((item) => (
          <ImageListItem key={item.img} sx={{ position: 'relative' }}>
            <img
              src={item.img} // ใช้ URL Blob ตรง ๆ
              alt={item.title}
              loading="lazy"
              className="hover-image" // เพิ่ม class ใหม่เพื่อให้ได้เอฟเฟกต
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: 8,
                objectFit: 'cover',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer', // เปลี่ยน cursor เมื่อ hover
              }}
              onClick={() => handleOpen(item.img)} // เปิด modal เมื่อคลิกที่รูป
            />
            {/* ปุ่มกากบาทสำหรับลบรูป */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'white',
                borderRadius: '50%',
                opacity: actions === "Reade" ? 0 : 1, // ทำให้ปุ่มโปร่งใสถ้าเป็น Reade
                pointerEvents: actions === "Reade" ? "none" : "auto", // ปิดการคลิกเมื่อเป็น Reade
              }}
              onClick={() => {
                if (actions !== "Reade") {
                  onRemoveImage(item.img);
                }
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </ImageListItem>
        ))}
      </ImageList>

      {/* Modal สำหรับแสดงรูปภาพขนาดใหญ่ */}
      <Modal open={open} onClose={handleClose}>
        <Box sx={modalStyle}>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Expanded view"
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '8px',
              }}
            />
          )}
        </Box>
      </Modal>
    </div>
  );
}
