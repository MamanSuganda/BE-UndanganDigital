module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define(
    "Event",
    {
      eventName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      eventDate: DataTypes.DATEONLY,
      startTime: DataTypes.TIME,
      endTime: DataTypes.TIME,
      locationName: DataTypes.STRING,
      locationAddress: DataTypes.TEXT,
      googleMapsUrl: DataTypes.TEXT,
    },
    {
      tableName: "events",
    }
  );

  return Event;
};
