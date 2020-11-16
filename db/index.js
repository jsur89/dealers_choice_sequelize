const Sequelize = require("sequelize");
const { STRING, INTEGER, DATE, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize("postgres://localhost/countryclub");

const facility = conn.define("facility", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  fac_name: {
    type: STRING(100),
    unique: true,
    allowNull: false,
  },
});

const member = conn.define("member", {
  id: {
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
  },
  first_name: {
    type: STRING(20),
    unique: true,
    allowNull: false,
  },
});

const booking = conn.define("booking", {
  id: {
    type: INTEGER,
    primaryKey: true,
  },
  startTime: {
    type: DATE,
    allowNull: false,
  },
  endTime: {
    type: DATE,
    allowNull: false,
  },
});

//Relationship establishment
booking.belongsTo(member, { as: "bookedBy" });
member.hasMany(booking, { foreignKey: "bookedById" });
booking.belongsTo(facility);

const syncAndSeed = async () => {
  await conn.sync({ force: true });
};

module.exports = { conn, syncAndSeed, models: { facility, member, booking } };
