import { createClient } from "@supabase/supabase-js";

const key = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRod2d4cmFrYnNpY3Zsc2pybHdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUyNzQxODIsImV4cCI6MjA5MDg1MDE4Mn0.0Lw2oeN34BIHmSvJUurOTiGhQOcqDnR6zFDGjoryahA`;

const url = "https://dhwgxrakbsicvlsjrlwp.supabase.co";

const supabase = createClient(url, key);

export default function uploadMediaToSupabase(file) {
  return new Promise((resolve, reject) => {
    if (file == null) {
      reject("File not added");
    }
    let fileName = file.name;
    const extension = fileName.split(".")[fileName.split(".").length - 1];

    const timestamp = new Date().getTime();

    fileName = timestamp +file.name+ "." + extension;

    supabase.storage.from("profile-images").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    }).then(()=>{
      const publicUrl = supabase.storage.from("profile-images").getPublicUrl(fileName).data.publicUrl;
      resolve(publicUrl);
    }).catch((err)=>{
      reject(err);
    });
  });
}






