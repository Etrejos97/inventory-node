// Equivalente a DataSeeder.java (perfil default del backend original):
// se siembra solo si la tabla de roles está vacía, igual que allá.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roleCount = await prisma.role.count();
  if (roleCount > 0) {
    console.log("La BD ya tiene roles. Omitiendo seed.");
    return;
  }

  const adminRole = await prisma.role.create({
    data: { name: "Administrador", description: "Acceso total al sistema" },
  });
  await prisma.role.create({
    data: { name: "Operador", description: "Acceso limitada a consultas y registro" },
  });

  await prisma.user.create({
    data: {
      username: "admin",
      password: "admin123",
      fullName: "Administrador",
      email: "admin@inventory.com",
      roleId: adminRole.id,
      isActive: true,
    },
  });

  const disponible = await prisma.status.create({
    data: { name: "Disponible", description: "Elemento disponible para uso" },
  });
  const enUso = await prisma.status.create({
    data: { name: "En uso", description: "Elemento asignado a un responsable" },
  });
  const mantenimiento = await prisma.status.create({
    data: { name: "En mantenimiento", description: "Elemento en reparación" },
  });
  const baja = await prisma.status.create({
    data: { name: "Dado de baja", description: "Elemento retirado del inventario" },
  });

  const hardware = await prisma.category.create({
    data: { name: "Hardware", description: "Equipos y componentes físicos" },
  });
  const software = await prisma.category.create({
    data: { name: "Software", description: "Programas y aplicaciones" },
  });
  const licencias = await prisma.category.create({
    data: { name: "Licencias", description: "Licencias y suscripciones" },
  });
  const redes = await prisma.category.create({
    data: { name: "Redes", description: "Equipos de red y conectividad" },
  });
  const consumibles = await prisma.category.create({
    data: { name: "Consumibles", description: "Insumos y repuestos" },
  });
  const gaming = await prisma.category.create({
    data: { name: "Gaming", description: "Periféricos y accesorios gaming" },
  });
  const audioVideo = await prisma.category.create({
    data: { name: "Audio y Video", description: "Equipos de audio, video y streaming" },
  });
  void software; // sembrada por paridad con el catálogo original; sin items propios en este seed

  const resp1 = await prisma.responsible.create({
    data: { fullName: "Carlos Mendoza", position: "Técnico de sistemas", email: "cmendoza@tech.com", phone: "3001234567", isActive: true },
  });
  const resp2 = await prisma.responsible.create({
    data: { fullName: "Ana López", position: "Coordinadora de TI", email: "alopez@tech.com", phone: "3002345678", isActive: true },
  });
  const resp3 = await prisma.responsible.create({
    data: { fullName: "Pedro Ramírez", position: "Soporte técnico", email: "pramirez@tech.com", phone: "3003456789", isActive: true },
  });
  await prisma.responsible.create({
    data: { fullName: "Laura Gómez", position: "Administradora de red", email: "lgomez@tech.com", phone: "3004567890", isActive: true },
  });
  await prisma.responsible.create({
    data: { fullName: "David Rojas", position: "Desarrollador", email: "drojas@tech.com", phone: "3005678901", isActive: true },
  });

  const items = [
    { name: "Laptop ASUS ROG Zephyrus G14", description: "Ryzen 9 7940HS, RTX 4060, 16GB DDR5, 1TB SSD, 14\" QHD 165Hz", serialNumber: "ROG-G14-001", categoryId: hardware.id, statusId: disponible.id, responsibleId: resp1.id, acquisitionDate: "2024-03-15", location: "Bodega A - E3", purchaseValue: "4599000", observations: null, stock: 5, minStock: 1 },
    { name: "PC Gamer AMD Ryzen 7 7800X3D", description: "RTX 4070 Ti, 32GB DDR5, 2TB NVMe, fuente 850W Gold", serialNumber: "PC-GAMER-001", categoryId: hardware.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-01", location: "Bodega A - E1", purchaseValue: "6299000", observations: null, stock: 3, minStock: 1 },
    { name: "Monitor Samsung Odyssey G7 27\"", description: "27\" QHD 240Hz, 1ms, HDR600, curvo 1000R", serialNumber: "OD-G7-27-023", categoryId: gaming.id, statusId: disponible.id, responsibleId: resp1.id, acquisitionDate: "2024-04-10", location: "Bodega A - E5", purchaseValue: "1899000", observations: null, stock: 8, minStock: 2 },
    { name: "iPad Air M2 11\" 256GB", description: "Apple M2, 256GB, WiFi 6E, lápiz USB-C compatible", serialNumber: "IPADAIR-M2-256", categoryId: hardware.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-05-20", location: "Bodega B - E2", purchaseValue: "3499000", observations: null, stock: 4, minStock: 1 },
    { name: "Teclado Mecánico Logitech G Pro X", description: "Switches GX Blue, RGB LIGHTSYNC, cable USB-C", serialNumber: "LOG-GPROX-TEC", categoryId: gaming.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-15", location: "Bodega A - E6", purchaseValue: "429900", observations: null, stock: 15, minStock: 5 },
    { name: "Mouse Razer DeathAdder V3 Pro", description: "Sensor Focus Pro 30K, 63g, inalámbrico", serialNumber: "RAZER-DAV3-PRO", categoryId: gaming.id, statusId: disponible.id, responsibleId: resp3.id, acquisitionDate: "2024-05-10", location: "Bodega A - E6", purchaseValue: "379900", observations: null, stock: 12, minStock: 5 },
    { name: "Audífonos HyperX Cloud II Wireless", description: "7.1 surround, 30h batería, 2.4GHz", serialNumber: "HX-CLOUD2-WL", categoryId: audioVideo.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-05", location: "Bodega A - E7", purchaseValue: "329900", observations: null, stock: 20, minStock: 5 },
    { name: "Audífonos Sony WH-1000XM5", description: "Cancelación de ruido activa, 30h, LDAC", serialNumber: "SONY-WH1000XM5", categoryId: audioVideo.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-20", location: "Bodega A - E7", purchaseValue: "899900", observations: null, stock: 7, minStock: 2 },
    { name: "Router TP-Link Archer AX73", description: "WiFi 6 AX5400, 6 antenas, puerto 2.5G", serialNumber: "TPLINK-AX73-001", categoryId: redes.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-01", location: "Bodega B - E1", purchaseValue: "299900", observations: null, stock: 10, minStock: 3 },
    { name: "Windows 11 Pro - Licencia Digital", description: "Licencia definitiva, 1 dispositivo", serialNumber: "WIN11PRO-DIG-001", categoryId: licencias.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-01", location: "Licencia digital", purchaseValue: "329900", observations: null, stock: 99, minStock: 10 },
    { name: "SSD Samsung 990 Pro 1TB NVMe", description: "PCIe 4.0, 7450MB/s lectura, 6900MB/s escritura", serialNumber: "SAM-990PRO-1TB", categoryId: consumibles.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-05-05", location: "Bodega B - E4", purchaseValue: "299900", observations: null, stock: 25, minStock: 5 },
    { name: "Memoria RAM Kingston Fury 32GB DDR5", description: "Kit 2x16GB, 5600MHz, RGB", serialNumber: "KF-DDR5-32GB", categoryId: consumibles.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-01", location: "Bodega B - E5", purchaseValue: "269900", observations: null, stock: 18, minStock: 5 },
    { name: "Laptop Lenovo ThinkPad X1 Carbon", description: "Intel i7-1365U, 16GB RAM, 512GB SSD", serialNumber: "TP-X1C11-023", categoryId: hardware.id, statusId: enUso.id, responsibleId: resp2.id, acquisitionDate: "2024-01-20", location: "Oficina 204", purchaseValue: "3899000", observations: "Asignada a Ana López", stock: 1, minStock: 0 },
    { name: "Monitor LG 24MK430H-B", description: "24\" IPS FullHD - EN REPARACIÓN", serialNumber: "LG-24MK430-012", categoryId: hardware.id, statusId: mantenimiento.id, responsibleId: resp3.id, acquisitionDate: "2023-08-20", location: "Taller", purchaseValue: "549900", observations: "Píxeles muertos", stock: 0, minStock: 0 },
    { name: "Teclado Microsoft Surface", description: "Dañado por líquido - DADO DE BAJA", serialNumber: null, categoryId: hardware.id, statusId: baja.id, responsibleId: null, acquisitionDate: "2023-05-10", location: "Descarte", purchaseValue: "249900", observations: null, stock: 0, minStock: 0 },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: {
        ...item,
        acquisitionDate: new Date(item.acquisitionDate),
      },
    });
  }

  console.log(`Seed lista: 2 roles, 1 usuario, 4 estados, 7 categorías, 5 responsables, ${items.length} items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
