// app.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const { sequelize, Invitation } = require("./models");
const wishesRoutes = require("./routes/wishesRoutes");

dotenv.config();

const app = express();

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));
// Izinkan semua origin (bisa dibatasi nanti jika perlu)

const allowedOrigins = [
  "http://localhost:5173", // Untuk development di komputer Anda
  "https://invid.my.id", // Untuk website produksi Anda
];

const corsOptions = {
  origin: function (origin, callback) {
    // Izinkan jika origin ada di dalam daftar atau jika tidak ada origin (misalnya request dari Postman)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Koneksi ke database MySQL
sequelize
  .authenticate()
  .then(() => {
    console.log("MySQL connected via Sequelize");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

sequelize.sync({ alter: true }).then(() => {
  console.log("Database & tables synced!");
});

// Route API
app.use("/api", authRoutes);
app.use("/api/invitations", invitationRoutes);
app.use("/api/wishes", wishesRoutes);

app.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const { Invitation } = require("./models");

    // Tidak perlu lagi 'include: User'
    const invitation = await Invitation.findOne({ where: { slug } });

    if (!invitation) {
      /* ... handle not found ... */
    }

    const frontendDomain = process.env.FRONTEND_URL || "https://invid.my.id";

    const dataForTemplate = {
      title: `UNDANGAN PERNIKAHAN MAMAN & MIZANA`,
      description: "Minggu, 27 Oktober 2024",
      // Ambil dari kolom 'thumbnailUrl' di undangan itu sendiri
      imageUrl:
        "https://res.cloudinary.com/dbss6rlbu/image/upload/v1750161903/invitation_thumbnails/t3fnejpauzg8ezl6ecmp.jpg",
      publicUrl: `https://api.invid.my.id/undangan/${invitation.slug}`,
      frontendUrl: `${frontendDomain}/invitation/${invitation.slug}`,

      invitationData: invitation,
    };
    res.render("invitation", dataForTemplate);
  } catch (error) {
    /* ... handle error ... */
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
