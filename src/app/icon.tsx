import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

export default function Icon() {
  const imagePath = path.join(process.cwd(), 'public/img/Otep.jpg');
  const imageBuffer = fs.readFileSync(imagePath);
  const imageSrc = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'transparent',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%', 
          overflow: 'hidden',  
        }}
      >
        <img
          src={imageSrc}
          alt="OTEP Logo"
          width="100%"
          height="100%"
          style={{ objectFit: 'cover' }} 
        />
      </div>
    ),
    { ...size }
  );
}