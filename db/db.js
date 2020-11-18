const Sequelize = require("sequelize");
const { STRING, INTEGER, DATE, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize("postgres://localhost/countryclub", {
  logging: false,
});

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
    type: UUID,
    primaryKey: true,
    defaultValue: UUIDV4,
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
  const nick = await Member.create({ first_name: "Nick", sponsorId: jared.id });
  const vanessa = await Member.create({ first_name: "Vanessa" });
  const rommel = await Member.create({ first_name: "Rommel" });
  const tennis1 = await Facility.create({ fac_name: "Tennis Court #1" });
  const tennis2 = await Facility.create({ fac_name: "Tennis Court #2" });
  const tennis3 = await Facility.create({ fac_name: "Tennis Court #3" });

  await Booking.create({
    startTime: "11/26/2020",
    endTime: "11/27/2020",
    bookedById: jared.id,
    facilityId: tennis1.id,
  });

  await Booking.create({
    startTime: "11/26/2020",
    endTime: "11/27/2020",
    bookedById: jared.id,
    facilityId: tennis2.id,
  });

  rommel.sponsorId = jared.id;
  vanessa.sponsorId = rommel.id;
  await rommel.save();
  await vanessa.save();
};

module.exports = { conn, syncAndSeed, models: { Facility, Member, Booking } };
