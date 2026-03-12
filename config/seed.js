const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();


const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['agent', 'manager', 'admin'], default: 'agent' },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

userSchema.methods.toPublicJSON = function () {
  return { _id: this._id, name: this.name, email: this.email, role: this.role };
};

const User = mongoose.models.User || mongoose.model('User', userSchema);

const clientSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
  siret: String,
  status: { type: String, enum: ['actif', 'inactif', 'contentieux'], default: 'actif' },
  assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: String,
}, { timestamps: true });

const Client = mongoose.models.Client || mongoose.model('Client', clientSchema);

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: { type: String, unique: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
  amount: Number,
  dueDate: Date,
  status: {
    type: String,
    enum: ['impayée', 'partiellement_payée', 'payée', 'contentieux', 'annulée'],
    default: 'impayée',
  },
  remainingAmount: Number,
  description: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema);


const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log(' MongoDB connected');

    await User.deleteMany({});
    await Client.deleteMany({});
    await Invoice.deleteMany({});
    console.log('️  Cleared existing data');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const [admin, manager, agent1, agent2] = await User.insertMany([
      { name: 'Admin User',    email: 'admin@recouvra.com',   password: hashedPassword, role: 'admin' },
      { name: 'Manager Paul',  email: 'manager@recouvra.com', password: hashedPassword, role: 'manager' },
      { name: 'Agent Sophie',  email: 'sophie@recouvra.com',  password: hashedPassword, role: 'agent' },
      { name: 'Agent Karim',   email: 'karim@recouvra.com',   password: hashedPassword, role: 'agent' },
    ]);
    console.log(' Users seeded');

    const [c1, c2, c3, c4, c5] = await Client.insertMany([
      {
        name: 'Société Dupont SARL',
        email: 'contact@dupont.fr',
        phone: '+33 1 23 45 67 89',
        address: '12 Rue de la Paix, Paris',
        siret: '12345678901234',
        status: 'actif',
        assignedAgent: agent1._id,
        notes: 'Client fidèle depuis 2020',
      },
      {
        name: 'Tech Innov SAS',
        email: 'info@techinnov.fr',
        phone: '+33 4 56 78 90 12',
        address: '5 Avenue des Champs, Lyon',
        siret: '98765432109876',
        status: 'contentieux',
        assignedAgent: agent2._id,
        notes: 'En litige depuis mars 2024',
      },
      {
        name: 'BTP Constructions',
        email: 'btp@constructions.fr',
        phone: '+33 5 67 89 01 23',
        address: '88 Boulevard Haussmann, Bordeaux',
        siret: '11223344556677',
        status: 'inactif',
        assignedAgent: agent1._id,
      },
      {
        name: 'Agro Bio Plus',
        email: 'contact@agrobio.fr',
        phone: '+33 3 78 90 12 34',
        address: '3 Chemin des Vignes, Toulouse',
        siret: '44556677889900',
        status: 'actif',
        assignedAgent: agent2._id,
      },
      {
        name: 'LogiTrans Express',
        email: 'logitrans@express.fr',
        phone: '+33 2 89 01 23 45',
        address: '21 Quai de la Loire, Nantes',
        siret: '55667788990011',
        status: 'contentieux',
        assignedAgent: agent1._id,
        notes: 'Plusieurs relances sans réponse',
      },
    ]);
    console.log(' Clients seeded');

    await Invoice.insertMany([
      {
        invoiceNumber: 'INV-2024-001',
        client: c1._id,
        amount: 5000,
        remainingAmount: 5000,
        dueDate: new Date('2024-03-01'),
        status: 'impayée',
        description: 'Prestation de conseil Q1 2024',
        createdBy: admin._id,
      },
      {
        invoiceNumber: 'INV-2024-002',
        client: c1._id,
        amount: 3200,
        remainingAmount: 1600,
        dueDate: new Date('2024-04-15'),
        status: 'partiellement_payée',
        description: 'Fourniture de matériel',
        createdBy: manager._id,
      },
      {
        invoiceNumber: 'INV-2024-003',
        client: c2._id,
        amount: 12000,
        remainingAmount: 12000,
        dueDate: new Date('2024-01-10'),
        status: 'contentieux',
        description: 'Développement logiciel phase 1',
        createdBy: admin._id,
      },
      {
        invoiceNumber: 'INV-2024-004',
        client: c3._id,
        amount: 8500,
        remainingAmount: 0,
        dueDate: new Date('2024-02-20'),
        status: 'payée',
        description: 'Travaux de rénovation',
        createdBy: manager._id,
      },
      {
        invoiceNumber: 'INV-2024-005',
        client: c4._id,
        amount: 2100,
        remainingAmount: 2100,
        dueDate: new Date('2024-05-01'),
        status: 'impayée',
        description: 'Livraison produits bio',
        createdBy: agent1._id,
      },
      {
        invoiceNumber: 'INV-2024-006',
        client: c5._id,
        amount: 6700,
        remainingAmount: 6700,
        dueDate: new Date('2023-12-15'),
        status: 'contentieux',
        description: 'Transport marchandises décembre',
        createdBy: admin._id,
      },
      {
        invoiceNumber: 'INV-2024-007',
        client: c2._id,
        amount: 4500,
        remainingAmount: 4500,
        dueDate: new Date('2024-06-30'),
        status: 'annulée',
        description: 'Maintenance annuelle — annulée',
        createdBy: manager._id,
      },
    ]);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(' Seed error:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};



seed();