import type { Category, Item, Responsible, Role, Status, User } from "@prisma/client";
import { decimalToNumber, formatDate, formatDateTime } from "@/lib/http";

type ItemWithRelations = Item & {
  category: Category;
  status: Status;
  responsible: Responsible | null;
};

// Equivalente a ItemService.toResponse en Java — shape aplanado (ItemResponse.java).
export function toItemResponse(item: ItemWithRelations) {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    serialNumber: item.serialNumber,
    categoryName: item.category.name,
    categoryId: item.categoryId,
    statusName: item.status.name,
    statusId: item.statusId,
    responsibleName: item.responsible?.fullName ?? null,
    responsibleId: item.responsibleId,
    acquisitionDate: formatDate(item.acquisitionDate),
    location: item.location,
    purchaseValue: decimalToNumber(item.purchaseValue),
    observations: item.observations,
    imageUrl: item.imageUrl,
    stock: item.stock,
    minStock: item.minStock,
    createdAt: formatDateTime(item.createdAt),
    updatedAt: formatDateTime(item.updatedAt),
  };
}

type UserWithRole = User & { role: Role };

// GET /api/users expone la entidad completa tal cual, password en texto plano
// incluido — ver docs/DEUDA.md. No es un shape a "mejorar", es el contrato.
export function toUserResponse(user: UserWithRole) {
  return {
    id: user.id,
    username: user.username,
    password: user.password,
    fullName: user.fullName,
    email: user.email,
    role: { id: user.role.id, name: user.role.name, description: user.role.description },
    isActive: user.isActive,
    lastLogin: formatDateTime(user.lastLogin),
  };
}
