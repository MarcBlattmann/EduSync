import { createClient } from './supabase/client';

export async function uploadImage(file: File): Promise<string> {
  const supabase = createClient();
  
  // Create a unique file name
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  
  // Upload the file to Supabase storage
  const { data, error } = await supabase
    .storage
    .from('content-images')
    .upload(fileName, file);

  if (error) {
    throw new Error('Failed to upload image');
  }

  // Get the public URL for the uploaded image
  const { data: { publicUrl } } = supabase
    .storage
    .from('content-images')
    .getPublicUrl(fileName);

  return publicUrl;
}
