// Dialog NPC — dari repo lama, dipertahankan teks aslinya

export interface DialogLine {
  speaker: string;
  text: string;
}

export type DialogScript = DialogLine[];

export const NPC_DIALOGUES: Record<string, DialogScript> = {
  ariman: [
    { speaker: 'Ariman', text: 'Eh, akhirnya kamu nyamperin juga! Gue udah nungguin dari tadi nih.' },
    { speaker: 'Ariman', text: 'Sini lah, duduk bentar. Teman-teman lain pada ke mana?' },
    { speaker: 'Kamu', text: 'Lagi nyariin semua nih, Ri. Makasih ya udah nungguin!' },
  ],
  putra: [
    { speaker: 'Putra', text: 'Bro! Kamu tuh, nyariin dari tadi katanya. Gue di sini mulu kok.' },
    { speaker: 'Putra', text: 'Tadi gue liat Ananda di arah SMPN 11, mungkin masih di sana.' },
    { speaker: 'Kamu', text: 'Siap Put, makasih infonya!' },
  ],
  ananda: [
    { speaker: 'Ananda', text: 'Hei hei! Kamu nyariin gue ya? Lama banget sih, gue udah hampir pulang nih.' },
    { speaker: 'Ananda', text: 'Eh by the way, tadi gue liat Zait masuk ke Konoha Mart tuh.' },
    { speaker: 'Kamu', text: 'Wah oke An, gue langsung ke sana!' },
  ],
  zait: [
    { speaker: 'Zait', text: 'Haha ketangkep juga! Gue lagi milih-milih jajanan nih di Konoha Mart.' },
    { speaker: 'Zait', text: 'Mahardhika kayaknya lagi main di danau deh.' },
    { speaker: 'Kamu', text: 'Mantap Zait, satu lagi nih!' },
  ],
  mahardhika: [
    { speaker: 'Mahardhika', text: 'Woah kamu bisa nemuin gue! Gue kira kamu nyerah.' },
    { speaker: 'Mahardhika', text: 'Kita semua kumpul sekarang! Ayo balik bareng.' },
    { speaker: 'Kamu', text: 'YES! Semua ketemu nih. Mantap banget sore ini!' },
  ],
  farhan: [
    { speaker: 'Farhan Hadi Lutfi', text: 'Yo, lagi nyariin temen-temen? Gue kasih tau nih...' },
    { speaker: 'Farhan Hadi Lutfi', text: 'Coba liat di sekitar taman, sekolah, sama danau. Semangat!' },
  ],
};

export const VENDOR_DIALOGUES: Record<string, DialogScript> = {
  bakso: [
    { speaker: 'Tukang Bakso', text: 'Baksooo! Bakso pak, mau pesan?' },
    { speaker: 'Kamu', text: 'Ada bakso apa aja?' },
    { speaker: 'Tukang Bakso', text: 'Ada bakso biasa, bakso urat, sama mi ayam. Pilih aja!' },
  ],
  eskrim: [
    { speaker: 'Tukang Es', text: 'Es krim, es potong, es krim...!' },
    { speaker: 'Kamu', text: 'Es krimnya ada rasa apa?' },
    { speaker: 'Tukang Es', text: 'Coklat, vanilla, stroberi! Lima ribuan aja mas/mbak.' },
  ],
  siomay: [
    { speaker: 'Tukang Siomay', text: 'Siomay, batagor, siomay!' },
    { speaker: 'Kamu', text: 'Mau siomay dong.' },
    { speaker: 'Tukang Siomay', text: 'Siap! Pake saus kacang ya? Enaknya dari situ.' },
  ],
  sate: [
    { speaker: 'Tukang Sate', text: 'Sate sate, sate ayam kambing!' },
    { speaker: 'Kamu', text: 'Satenya masih ada?' },
    { speaker: 'Tukang Sate', text: 'Masih mas/mbak! Mau ayam apa kambing? Lima tusuk dua puluh ribu.' },
  ],
};
