export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  const cloudFormData = new FormData();
  cloudFormData.append('file', file);
  cloudFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: cloudFormData }
  );

  const data = await res.json();
  return Response.json({ url: data.secure_url });
}