const express = require("express");
const router = express.Router();
// Impor model dari file index utama agar relasi terbaca
const { Wish, Invitation } = require("../models");

// ENDPOINT 1: GET - Mengambil semua ucapan untuk undangan tertentu
// GET /api/wishes/:slug
router.get("/", async (req, res) => {
  try {
    // Langsung ambil semua data dari tabel Wish
    // Urutkan berdasarkan yang paling baru
    const wishes = await Wish.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(wishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// ENDPOINT 2: POST - Menyimpan ucapan baru untuk undangan tertentu
// POST /api/wishes/:slug
router.post("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { nama, ucapan, konfirmasi, jumlah } = req.body;

    // 1. Cari dulu undangan berdasarkan slug untuk mendapatkan ID-nya
    const invitation = await Invitation.findOne({ where: { slug } });
    if (!invitation) {
      return res.status(404).json({ message: "Undangan tidak ditemukan" });
    }

    // 2. Buat ucapan baru dengan menyertakan invitationId
    const newWish = await Wish.create({
      nama,
      ucapan,
      konfirmasi,
      jumlah,
      invitationId: invitation.id, // Hubungkan ucapan ini dengan ID undangan
    });

    res.status(201).json(newWish);
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ msg: "Input tidak valid", error: err.message });
  }
});

module.exports = router;
