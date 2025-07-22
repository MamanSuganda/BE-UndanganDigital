// models/index.js
const { Sequelize, DataTypes } = require("sequelize");
const UserModel = require("./User");
const InvitationModel = require("./Invitation");
const WishModel = require("./Wish");
const EventModel = require("./Event");
const BankAccountModel = require("./BankAccount");
require("dotenv").config();

// Inisialisasi koneksi ke MySQL menggunakan variabel dari .env
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false,
  }
);

// Inisialisasi model
const User = UserModel(sequelize, DataTypes);
const Invitation = InvitationModel(sequelize, DataTypes);
const Wish = WishModel(sequelize, DataTypes);
const Event = EventModel(sequelize, DataTypes);
const BankAccount = BankAccountModel(sequelize, DataTypes);

// Definisikan relasi (associations) di sini

// Relasi antar User dan Invitation
User.hasMany(Invitation, { foreignKey: "userId", onDelete: "CASCADE" });
Invitation.belongsTo(User, { foreignKey: "userId" });

// Relasi Invitation dengan Wish
Invitation.hasMany(Wish, { as: "wishes", foreignKey: "invitationId" });
Wish.belongsTo(Invitation, {
  as: "invitation",
  foreignKey: "invitationId",
});

// Relasi Invitation dengan Event
Invitation.hasMany(Event, { as: "events", foreignKey: "invitationId" });
Event.belongsTo(Invitation, { as: "invitation", foreignKey: "invitationId" });

// Relasi Invitation dengan BankAccount
Invitation.hasMany(BankAccount, {
  as: "bankAccounts",
  foreignKey: "invitationId",
});
BankAccount.belongsTo(Invitation, {
  as: "invitation",
  foreignKey: "invitationId",
});

// Sinkronisasi model ke database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables synced");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = {
  sequelize,
  User,
  Invitation,
  Wish,
};
