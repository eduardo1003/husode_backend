const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Define Admin
const Admin = sequelize.define('Admin', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Define Project
const Project = sequelize.define('Project', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  shortDescription: { type: DataTypes.TEXT },
  longDescription: { type: DataTypes.TEXT },
  objectives: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE },
  status: { type: DataTypes.STRING, defaultValue: 'activo' }, // activo, finalizado
  isFeatured: { type: DataTypes.BOOLEAN, defaultValue: false },
  coverImage: { type: DataTypes.STRING }
});

// Define Image (Gallery & Projects & Events)
const Image = sequelize.define('Image', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  public_id: { type: DataTypes.STRING, allowNull: false },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  album: { type: DataTypes.STRING }
});

// Define Video (Gallery & Projects & Events)
const Video = sequelize.define('Video', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  url: { type: DataTypes.STRING, allowNull: false },
  public_id: { type: DataTypes.STRING, allowNull: false },
  thumbnail: { type: DataTypes.STRING },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.STRING },
  album: { type: DataTypes.STRING }
});

// Define News
const News = sequelize.define('News', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  content: { type: DataTypes.TEXT, allowNull: false },
  coverImage: { type: DataTypes.STRING },
  tags: { type: DataTypes.JSONB, defaultValue: [] },
});

// Define Event
const Event = sequelize.define('Event', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  date: { type: DataTypes.DATE, allowNull: false },
  coverImage: { type: DataTypes.STRING },
});

// Define Slider
const Slider = sequelize.define('Slider', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  title: { type: DataTypes.STRING },
  subtitle: { type: DataTypes.STRING },
  type: { type: DataTypes.STRING, defaultValue: 'image' }, // 'image' or 'video'
  url: { type: DataTypes.STRING, allowNull: false },
  public_id: { type: DataTypes.STRING },
  buttonText: { type: DataTypes.STRING },
  buttonLink: { type: DataTypes.STRING },
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

// Define Config (General Settings)
const Config = sequelize.define('Config', {
  key: { type: DataTypes.STRING, primaryKey: true },
  value: { type: DataTypes.TEXT },
});

// Define Contact
const Contact = sequelize.define('Contact', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false },
  subject: { type: DataTypes.STRING },
  message: { type: DataTypes.TEXT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'unread' } // unread, read, replied
});

// Define Log
const Log = sequelize.define('Log', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  user: { type: DataTypes.STRING, allowNull: false },
  action: { type: DataTypes.STRING, allowNull: false },
  details: { type: DataTypes.TEXT },
  ip: { type: DataTypes.STRING }
});

// Relationships
Project.hasMany(Image, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Image.belongsTo(Project, { foreignKey: 'projectId' });

Project.hasMany(Video, { foreignKey: 'projectId', onDelete: 'CASCADE' });
Video.belongsTo(Project, { foreignKey: 'projectId' });

Event.hasMany(Image, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Image.belongsTo(Event, { foreignKey: 'eventId' });

Event.hasMany(Video, { foreignKey: 'eventId', onDelete: 'CASCADE' });
Video.belongsTo(Event, { foreignKey: 'eventId' });

News.hasMany(Image, { foreignKey: 'newsId', onDelete: 'CASCADE' });
Image.belongsTo(News, { foreignKey: 'newsId' });

// Define Directive (Board members)
const Directive = sequelize.define('Directive', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, allowNull: false }, // Cargo
  email: { type: DataTypes.STRING },
  photo: { type: DataTypes.STRING }, // Cloudinary URL
  public_id: { type: DataTypes.STRING }, // To delete from cloudinary
  order: { type: DataTypes.INTEGER, defaultValue: 0 }
});

module.exports = {
  sequelize,
  Admin,
  Project,
  Image,
  Video,
  News,
  Event,
  Slider,
  Config,
  Contact,
  Log,
  Directive
};
