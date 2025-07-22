module.exports = (sequelize, DataTypes) => {
  const BankAccount = sequelize.define(
    "BankAccount",
    {
      bankName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      accountHolder: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "bank_accounts",
    }
  );

  return BankAccount;
};
