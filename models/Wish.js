module.exports = (sequelize, DataTypes) => {
  const Wish = sequelize.define(
    "Wish",
    {
      // Model attributes are defined here
      nama: {
        type: DataTypes.STRING, // Sekarang 'DataTypes' sudah dikenali dari argumen
        allowNull: false,
      },
      ucapan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      konfirmasi: {
        type: DataTypes.ENUM("hadir", "tidak_hadir"),
        allowNull: false,
      },
      jumlah: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    {
      tableName: "wishes",
    }
  );

  return Wish;
};
