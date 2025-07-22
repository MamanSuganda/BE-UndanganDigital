// routes/invitationRoutes.js
const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { Invitation } = require("../models");
const slugify = require("slugify");
const verifyToken = require("../middleware/verifyToken");

//BUAT DATA UNDUANGAN
router.post("/", auth, async (req, res) => {
  const { guestName, address, phone, guestCount, recipientType } = req.body;
  const { id: userId, username } = req.user;

  try {
    // Membuat slug yang lebih bersih dan deskriptif
    const baseSlug = slugify(username, { lower: true, strict: true });
    const slug = `${baseSlug}-${Date.now()}`;

    // HANYA SIMPAN SLUG, BUKAN URL LENGKAP
    const newInvitation = await Invitation.create({
      guestName,
      address,
      phone,
      guestCount,
      recipientType,
      slug, // Simpan slug yang sudah benar
      userId,
    });

    // Kirim kembali data undangan lengkap (yang berisi slug) ke frontend
    res.status(201).json(newInvitation);
    console.log("Data yang dikirim balik ke frontend:", newInvitation.toJSON());
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating invitation" });
  }
});

// EDIT DATA UNDUANGAN
router.put("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;
  try {
    const [updatedRowsCount] = await Invitation.update(req.body, {
      where: { id, userId: req.user.id },
    });

    if (updatedRowsCount === 0) {
      return res.status(404).json({ message: "Undangan tidak ditemukan" });
    }

    const updatedInvitation = await Invitation.findByPk(id);
    res.json(updatedInvitation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal memperbarui undangan" });
  }
});

// HAPUS DATA UNDANGAN
router.delete("/:id", verifyToken, async (req, res) => {
  const { id } = req.params;

  try {
    const deletedCount = await Invitation.destroy({
      where: {
        id,
        userId: req.user.id, // agar hanya user yang bersangkutan bisa hapus datanya
      },
    });

    if (deletedCount === 0) {
      return res.status(404).json({ message: "Undangan tidak ditemukan" });
    }

    res.json({ message: "Undangan berhasil dihapus" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal menghapus undangan" });
  }
});

// GET DAFTAR UNDUANGAN
router.get("/", auth, async (req, res) => {
  try {
    const userId = req.user.id; // ✅ sesuaikan dengan token jwt
    const invitations = await Invitation.findAll({
      where: { userId },
    });

    res.json(invitations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil daftar undangan" });
  }
});

//Mengambil satu undangan berdasarkan SLUG (mengembalikan JSON)
router.get("/slug/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const invitation = await Invitation.findOne({ where: { slug } });

    if (!invitation) {
      return res.status(404).json({ message: "Undangan tidak ditemukan" });
    }

    res.json(invitation); // <-- Mengembalikan data dalam format JSON
  } catch (error) {
    console.error("Gagal mengambil data via slug:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
