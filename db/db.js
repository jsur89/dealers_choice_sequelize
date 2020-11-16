const Sequelize = require("sequelize");
const { STRING, INTEGER, DATE, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize("postgres://localhost/countryclub");

const Facility = conn.define("facility", {
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

const Member = conn.define("member", {
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

const Booking = conn.define("booking", {
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
Booking.belongsTo(Member, { as: "bookedBy" });
Booking.belongsTo(Facility);
Facility.hasMany(Booking);

Member.belongsTo(Member, { as: "sponsor" });
Member.hasMany(Member, { as: "sponsored", foreignKey: "sponsorId" });
Member.hasMany(Booking, { foreignKey: "bookedById" });

const syncAndSeed = async () => {
  await conn.sync({ force: true });
  const jared = await Member.create({ first_name: "Jared" });
};

module.exports = { conn, syncAndSeed, models: { Facility, Member, Booking } };
