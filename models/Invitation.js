const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Invitation = sequelize.define(
    "Invitation",
    {
      guestName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      phone: {
        type: DataTypes.STRING,
      },
      guestCount: {
        type: DataTypes.INTEGER,
      },
      recipientType: {
        type: DataTypes.ENUM("Pribadi", "Grup"),
        defaultValue: "Pribadi",
      },
      slug: {
        type: DataTypes.STRING,
        unique: true,
      },
      thumbnailUrl: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      templateId: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "classic",
      },
      groomName: DataTypes.STRING,
      brideName: DataTypes.STRING,
      groomParents: DataTypes.STRING,
      brideParents: DataTypes.STRING,
      heroPhotoUrl: DataTypes.STRING,
      groomPhotoUrl: DataTypes.STRING,
      bridePhotoUrl: DataTypes.STRING,
      musicUrl: DataTypes.STRING,
      gallery: {
        type: DataTypes.JSON, // Menyimpan array URL gambar
        defaultValue: [],
      },
      layoutConfig: {
        type: DataTypes.JSON, // Menyimpan objek konfigurasi
        defaultValue: {},
      },
    },
    {
      tableName: "invitations",
    }
  );

  return Invitation;
};
