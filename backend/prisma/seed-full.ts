// Equivalente a SeedDatabase.java (perfil "seed" del backend original):
// dataset más grande, opt-in, corrido a mano con `npm run db:seed-full`.
// Guard igual al original: si ya hay items, no hace nada.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function findOrCreateCategory(name: string, description: string) {
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.category.create({ data: { name, description } });
}

async function findOrCreateStatus(name: string, description: string) {
  const existing = await prisma.status.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.status.create({ data: { name, description } });
}

async function findOrCreateRole(name: string, description: string) {
  const existing = await prisma.role.findUnique({ where: { name } });
  if (existing) return existing;
  return prisma.role.create({ data: { name, description } });
}

async function main() {
  const itemCount = await prisma.item.count();
  if (itemCount > 0) {
    console.log("La BD ya tiene items. Omitiendo seed-full.");
    return;
  }

  console.log("Sembrando dataset completo...\n");

  const adminRole = await findOrCreateRole("Administrador", "Acceso total al sistema");
  const operatorRole = await findOrCreateRole("Operador", "Acceso limitada a consultas y registro");
  console.log("✓ Roles listos");

  if ((await prisma.user.count()) === 0) {
    await prisma.user.createMany({
      data: [
        { username: "admin", password: "admin123", fullName: "Administrador", email: "admin@inventory.com", roleId: adminRole.id, isActive: true },
        { username: "operador1", password: "pass123", fullName: "Carlos López", email: "carlos@inventory.com", roleId: operatorRole.id, isActive: true },
        { username: "tecnico1", password: "pass123", fullName: "Ana Martínez", email: "ana@inventory.com", roleId: operatorRole.id, isActive: true },
        { username: "invitado", password: "invitado", fullName: "Invitado", email: "invitado@inventory.com", roleId: operatorRole.id, isActive: true },
      ],
    });
    console.log("✓ Usuarios creados");
  }

  const disponible = await findOrCreateStatus("Disponible", "Elemento disponible para uso");
  const enUso = await findOrCreateStatus("En uso", "Elemento asignado a un responsable");
  const mantenimiento = await findOrCreateStatus("En mantenimiento", "Elemento en reparación");
  const baja = await findOrCreateStatus("Dado de baja", "Elemento retirado del inventario");
  console.log("✓ Estados listos");

  const hardwareCat = await findOrCreateCategory("Hardware", "Equipos y componentes físicos");
  const softwareCat = await findOrCreateCategory("Software", "Programas y aplicaciones");
  const licenciasCat = await findOrCreateCategory("Licencias", "Licencias y suscripciones");
  const redesCat = await findOrCreateCategory("Redes", "Equipos de red y conectividad");
  const consumiblesCat = await findOrCreateCategory("Consumibles", "Insumos y repuestos");
  const gamingCat = await findOrCreateCategory("Gaming", "Periféricos y accesorios gaming");
  const audioCat = await findOrCreateCategory("Audio y Video", "Equipos de audio, video y streaming");
  console.log("✓ Categorías listas");

  if ((await prisma.responsible.count()) < 5) {
    await prisma.responsible.deleteMany();
    await prisma.responsible.createMany({
      data: [
        { fullName: "Carlos Mendoza", position: "Técnico de sistemas", email: "cmendoza@tech.com", phone: "3001234567", isActive: true },
        { fullName: "Ana López", position: "Coordinadora de TI", email: "alopez@tech.com", phone: "3002345678", isActive: true },
        { fullName: "Pedro Ramírez", position: "Soporte técnico", email: "pramirez@tech.com", phone: "3003456789", isActive: true },
        { fullName: "Laura Gómez", position: "Administradora de red", email: "lgomez@tech.com", phone: "3004567890", isActive: true },
        { fullName: "David Rojas", position: "Desarrollador", email: "drojas@tech.com", phone: "3005678901", isActive: true },
      ],
    });
    console.log("✓ Responsables creados");
  }

  const resp1 = await prisma.responsible.findFirstOrThrow({ where: { fullName: "Carlos Mendoza" } });
  const resp2 = await prisma.responsible.findFirstOrThrow({ where: { fullName: "Ana López" } });
  const resp3 = await prisma.responsible.findFirstOrThrow({ where: { fullName: "Pedro Ramírez" } });
  const resp4 = await prisma.responsible.findFirstOrThrow({ where: { fullName: "Laura Gómez" } });
  const resp5 = await prisma.responsible.findFirstOrThrow({ where: { fullName: "David Rojas" } });

  const items = [
    // HARDWARE
    { name: "Laptop ASUS ROG Zephyrus G14", description: "Ryzen 9 7940HS, RTX 4060, 16GB DDR5, 1TB SSD, pantalla 14\" QHD 165Hz", serialNumber: "ROG-G14-2024-001", categoryId: hardwareCat.id, statusId: disponible.id, responsibleId: resp1.id, acquisitionDate: "2024-03-15", location: "Bodega A - Estante 3", purchaseValue: "4599000", observations: null, stock: 5, minStock: 1 },
    { name: "Laptop Lenovo ThinkPad X1 Carbon Gen 11", description: "Intel i7-1365U, 16GB RAM, 512GB SSD, 14\" WUXGA", serialNumber: "TP-X1C11-023", categoryId: hardwareCat.id, statusId: enUso.id, responsibleId: resp2.id, acquisitionDate: "2024-01-20", location: "Oficina 204 - Puesto 1", purchaseValue: "3899000", observations: "Asignada a Ana López", stock: 1, minStock: 0 },
    { name: "PC Gamer AMD Ryzen 7 7800X3D", description: "RTX 4070 Ti, 32GB DDR5, 2TB NVMe, fuente 850W Gold", serialNumber: "PC-GAMER-001", categoryId: hardwareCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-01", location: "Bodega A - Estante 1", purchaseValue: "6299000", observations: null, stock: 3, minStock: 1 },
    { name: "Monitor Samsung Odyssey G7 27\"", description: "27\" QHD 240Hz, 1ms, HDR600, curvo 1000R", serialNumber: "OD-G7-27-023", categoryId: gamingCat.id, statusId: disponible.id, responsibleId: resp1.id, acquisitionDate: "2024-04-10", location: "Bodega A - Estante 5", purchaseValue: "1899000", observations: "Monitor para estación gaming", stock: 8, minStock: 2 },
    { name: "Monitor Dell UltraSharp U2723QE 27\"", description: "27\" 4K UHD, IPS Black, USB-C Hub 90W", serialNumber: "DELL-U2723-045", categoryId: hardwareCat.id, statusId: enUso.id, responsibleId: resp2.id, acquisitionDate: "2024-02-05", location: "Oficina 204 - Puesto 2", purchaseValue: "2199000", observations: null, stock: 1, minStock: 0 },
    { name: "iPad Air M2 11\" 256GB", description: "Apple M2, 256GB, WiFi 6E, lápiz USB-C compatible", serialNumber: "IPADAIR-M2-256", categoryId: hardwareCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-05-20", location: "Bodega B - Estante 2", purchaseValue: "3499000", observations: null, stock: 4, minStock: 1 },
    { name: "Webcam Logitech Brio 4K", description: "4K Ultra HD, enfoque automático, reducción de ruido", serialNumber: "LOG-BRIO-4K-001", categoryId: hardwareCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-01", location: "Bodega A - Estante 4", purchaseValue: "549900", observations: null, stock: 12, minStock: 3 },

    // GAMING
    { name: "Teclado Mecánico Logitech G Pro X", description: "Switches GX Blue táctiles, RGB LIGHTSYNC, cable desmontable USB-C", serialNumber: "LOG-GPROX-TEC", categoryId: gamingCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-15", location: "Bodega A - Estante 6", purchaseValue: "429900", observations: null, stock: 15, minStock: 5 },
    { name: "Mouse Razer DeathAdder V3 Pro", description: "Sensor Focus Pro 30K, 63g, inalámbrico, hasta 90h batería", serialNumber: "RAZER-DAV3-PRO", categoryId: gamingCat.id, statusId: disponible.id, responsibleId: resp3.id, acquisitionDate: "2024-05-10", location: "Bodega A - Estante 6", purchaseValue: "379900", observations: null, stock: 12, minStock: 5 },
    { name: "Mouse Logitech MX Master 3S", description: "Sensor 8000 DPI, silent clicks, USB-C, MagSpeed", serialNumber: "LOG-MX3S-001", categoryId: hardwareCat.id, statusId: enUso.id, responsibleId: resp5.id, acquisitionDate: "2024-01-10", location: "Oficina 205 - Puesto 1", purchaseValue: "349900", observations: null, stock: 1, minStock: 0 },

    // AUDIO Y VIDEO
    { name: "Audífonos HyperX Cloud II Wireless", description: "7.1 surround virtual, 30h batería, 2.4GHz, drivers 53mm", serialNumber: "HX-CLOUD2-WL", categoryId: audioCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-05", location: "Bodega A - Estante 7", purchaseValue: "329900", observations: null, stock: 20, minStock: 5 },
    { name: "Audífonos Sony WH-1000XM5", description: "Cancelación de ruido activa, 30h, LDAC, multipunto", serialNumber: "SONY-WH1000XM5", categoryId: audioCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-20", location: "Bodega A - Estante 7", purchaseValue: "899900", observations: null, stock: 7, minStock: 2 },
    { name: "Micrófono Blue Yeti X", description: "Patrón de grabación múltiple, RGB, plug & play USB", serialNumber: "BLUE-YETIX-001", categoryId: audioCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-02-28", location: "Bodega A - Estante 8", purchaseValue: "549900", observations: null, stock: 10, minStock: 3 },

    // REDES
    { name: "Router TP-Link Archer AX73", description: "WiFi 6 AX5400, 6 antenas, puerto 2.5G, Mesh compatible", serialNumber: "TPLINK-AX73-001", categoryId: redesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-01", location: "Bodega B - Estante 1", purchaseValue: "299900", observations: null, stock: 10, minStock: 3 },
    { name: "Router ASUS RT-AX86U Pro", description: "WiFi 6 AX5700, gaming, 2.5G, AiMesh, VPN", serialNumber: "ASUS-AX86UP-001", categoryId: redesCat.id, statusId: disponible.id, responsibleId: resp4.id, acquisitionDate: "2024-05-25", location: "Oficina 102 - Rack", purchaseValue: "549900", observations: null, stock: 5, minStock: 1 },
    { name: "Switch Cisco SG250-08", description: "8 puertos Gigabit, administrable, PoE+ 67W", serialNumber: "CISCO-SG250-08", categoryId: redesCat.id, statusId: enUso.id, responsibleId: resp4.id, acquisitionDate: "2023-11-15", location: "Oficina 102 - Rack", purchaseValue: "429900", observations: null, stock: 1, minStock: 0 },
    { name: "Access Point Ubiquiti UniFi 6 Pro", description: "WiFi 6, 5.3 Gbps, PoE+, gestión UniFi", serialNumber: "UBIQUITI-U6PRO", categoryId: redesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-10", location: "Bodega B - Estante 1", purchaseValue: "249900", observations: "Para expansión de red", stock: 6, minStock: 2 },
    { name: "Cable RJ45 CAT6 UTP 10m", description: "Cable de red blindado, 10 metros, con protectores", serialNumber: null, categoryId: redesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-01-05", location: "Bodega B - Estante 3", purchaseValue: "24900", observations: null, stock: 50, minStock: 10 },

    // SOFTWARE
    { name: "Microsoft 365 Business Basic", description: "Suscripción anual, 1TB OneDrive, Teams, Exchange", serialNumber: "M365-BASIC-2024", categoryId: softwareCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-01-01", location: "Licencia digital", purchaseValue: "189900", observations: "Licencia para 1 usuario/año", stock: 99, minStock: 10 },
    { name: "Adobe Creative Cloud - Plan Anual", description: "Photoshop, Illustrator, Premiere, After Effects, 100GB", serialNumber: "ADOBE-CC-2024", categoryId: softwareCat.id, statusId: enUso.id, responsibleId: resp5.id, acquisitionDate: "2024-02-01", location: "Licencia digital - Asignada", purchaseValue: "899900", observations: "Asignada a David Rojas", stock: 1, minStock: 0 },

    // LICENCIAS
    { name: "Windows 11 Pro - Licencia Digital", description: "Licencia digital definitiva, transferible, 1 dispositivo", serialNumber: "WIN11PRO-DIG-001", categoryId: licenciasCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-01", location: "Licencia digital", purchaseValue: "329900", observations: null, stock: 99, minStock: 10 },
    { name: "Antivirus ESET Internet Security 2024", description: "3 dispositivos, 1 año, protección avanzada", serialNumber: "ESET-2024-3DEV", categoryId: licenciasCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-01-15", location: "Licencia digital", purchaseValue: "89900", observations: null, stock: 30, minStock: 10 },

    // CONSUMIBLES
    { name: "SSD Samsung 990 Pro 1TB NVMe", description: "PCIe 4.0, 7450MB/s lectura, 6900MB/s escritura", serialNumber: "SAM-990PRO-1TB", categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-05-05", location: "Bodega B - Estante 4", purchaseValue: "299900", observations: null, stock: 25, minStock: 5 },
    { name: "Disco Duro Externo WD 2TB", description: "2TB, USB 3.2, portátil, negro, cifrado HW", serialNumber: "WD-EXT-2TB-001", categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-20", location: "Bodega B - Estante 4", purchaseValue: "229900", observations: null, stock: 15, minStock: 3 },
    { name: "Memoria RAM Kingston Fury 32GB DDR5", description: "Kit 2x16GB, 5600MHz, RGB, Intel XMP 3.0", serialNumber: "KF-DDR5-32GB", categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-06-01", location: "Bodega B - Estante 5", purchaseValue: "269900", observations: null, stock: 18, minStock: 5 },
    { name: "Tóner HP LaserJet 58A Original", description: "Negro, 12000 páginas, original HP, alto rendimiento", serialNumber: "HP-58A-TONER", categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-03-10", location: "Bodega B - Estante 6", purchaseValue: "189900", observations: null, stock: 20, minStock: 5 },
    { name: "Cable HDMI 2.1 3m", description: "HDMI 2.1, 48Gbps, 8K@60Hz, 4K@120Hz, HDR10+, blindado", serialNumber: null, categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-02-15", location: "Bodega B - Estante 3", purchaseValue: "34900", observations: null, stock: 50, minStock: 10 },
    { name: "Hub USB-C 7 en 1", description: "HDMI 4K, 3x USB 3.0, SD/TF, USB-C PD 100W, Gigabit Ethernet", serialNumber: "USBCHUB-7IN1", categoryId: consumiblesCat.id, statusId: disponible.id, responsibleId: null, acquisitionDate: "2024-04-05", location: "Bodega B - Estante 3", purchaseValue: "89900", observations: null, stock: 22, minStock: 5 },

    // EN MANTENIMIENTO / BAJA
    { name: "Monitor LG 24MK430H-B 24\"", description: "24\" IPS FullHD, 75Hz, HDMI+VGA - EN REPARACIÓN por píxeles muertos", serialNumber: "LG-24MK430-012", categoryId: hardwareCat.id, statusId: mantenimiento.id, responsibleId: resp3.id, acquisitionDate: "2023-08-20", location: "Taller de soporte", purchaseValue: "549900", observations: "Pantalla con píxeles muertos - esperando repuesto", stock: 0, minStock: 0 },
    { name: "Teclado Microsoft Surface", description: "Teclado oficial Surface Pro 9, negro, español - DAÑADO", serialNumber: null, categoryId: hardwareCat.id, statusId: baja.id, responsibleId: null, acquisitionDate: "2023-05-10", location: "Bodega de descarte", purchaseValue: "249900", observations: "Daño por líquido - dado de baja", stock: 0, minStock: 0 },
    { name: "Hub USB Anker 4 puertos", description: "Hub USB-A 3.0, 4 puertos, alimentación externa - FALLA INTERMITENTE", serialNumber: "ANKER-HUB-004", categoryId: consumiblesCat.id, statusId: mantenimiento.id, responsibleId: null, acquisitionDate: "2024-01-20", location: "Taller de soporte", purchaseValue: "45900", observations: "Falla intermitente en 2 puertos", stock: 0, minStock: 0 },
  ];

  for (const item of items) {
    await prisma.item.create({
      data: {
        ...item,
        acquisitionDate: new Date(item.acquisitionDate),
      },
    });
  }

  console.log(`✓ ${items.length} productos creados`);
  console.log("\n¡Base de datos poblada exitosamente!");
  console.log("  Usuarios: admin/admin123, operador1/pass123, tecnico1/pass123, invitado/invitado");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
