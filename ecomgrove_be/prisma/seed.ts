import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const roles = [
  { name: 'admin', description: 'Administrator with full access' },
  { name: 'seller', description: 'Manages products and orders' },
  { name: 'customer', description: 'Regular customer account' },
  { name: 'manager', description: 'Oversees sellers and operations' },
  { name: 'support', description: 'Handles customer support' },
  { name: 'marketing', description: 'Handles campaigns and promotions' },
  { name: 'accountant', description: 'Manages financial reports' },
];

const resources = [
  'product',
  'user',
  'order',
  'category',
  'inventory',
  'discount',
  'report',
  'ticket',
];

const actions = ['create', 'read', 'update', 'delete'];

const permissionGroupDefs = [
  { name: 'User Management', resources: ['user'] },
  {
    name: 'Product Management',
    resources: ['product', 'inventory', 'category'],
  },
  { name: 'Order Management', resources: ['order'] },
  { name: 'Discounts & Marketing', resources: ['discount'] },
  { name: 'Reports', resources: ['report'] },
  { name: 'Tickets', resources: ['ticket'] },
];

const categoryNames = ['Electronics', 'Books', 'Clothing', 'Furniture', 'Toys'];

async function seedRoles() {
  const roleMap = new Map<string, { id: string }>();
  for (const role of roles) {
    const r = await prisma.role.upsert({
      where: { name: role.name },
      update: {},
      create: role,
    });
    roleMap.set(role.name, r);
  }
  return roleMap;
}

async function seedPermissionGroups() {
  const groupMap = new Map<string, { id: string }>();
  for (const def of permissionGroupDefs) {
    const group = await prisma.permissionGroup.upsert({
      where: { name: def.name },
      update: {},
      create: {
        name: def.name,
        description: `${def.name} related permissions`,
      },
    });
    for (const res of def.resources) {
      groupMap.set(res, group);
    }
  }
  return groupMap;
}

async function seedPermissions(groupMap: Map<string, { id: string }>) {
  const permissionData = resources.flatMap((resource) =>
    actions.map((action) => ({
      name: `${resource}:${action}`,
      displayName: `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource}`,
      resource,
      action,
      groupId: groupMap.get(resource)?.id ?? null,
    })),
  );

  return await Promise.all(
    permissionData.map((perm) =>
      prisma.permission.upsert({
        where: { name: perm.name },
        update: {},
        create: perm,
      }),
    ),
  );
}

function getPermissionsForRole(role: string, permissions: any[]) {
  switch (role) {
    case 'admin':
      return permissions;
    case 'seller':
      return permissions.filter(
        (p) =>
          ['product', 'order', 'inventory'].includes(p.resource) &&
          p.action !== 'delete',
      );
    case 'customer':
      return permissions.filter(
        (p) => ['product', 'order'].includes(p.resource) && p.action === 'read',
      );
    case 'manager':
      return permissions.filter((p) =>
        ['product', 'order', 'inventory', 'user'].includes(p.resource),
      );
    case 'support':
      return permissions.filter((p) => ['ticket'].includes(p.resource));
    case 'marketing':
      return permissions.filter((p) =>
        ['discount', 'category'].includes(p.resource),
      );
    case 'accountant':
      return permissions.filter((p) =>
        ['report', 'order'].includes(p.resource),
      );
    default:
      return [];
  }
}

async function assignPermissionsToRoles(
  roleMap: Map<string, { id: string }>,
  permissions: any[],
) {
  for (const role of roles) {
    const roleEntity = roleMap.get(role.name);
    if (!roleEntity) continue;

    const perms = getPermissionsForRole(role.name, permissions);

    await Promise.allSettled(
      perms.map((p) =>
        prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: roleEntity.id,
              permissionId: p.id,
            },
          },
          update: {},
          create: {
            roleId: roleEntity.id,
            permissionId: p.id,
          },
        }),
      ),
    );
  }
}

async function createAdminUser(
  roleMap: Map<string, { id: string }>,
  password: string,
) {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const adminUser = await prisma.user.create({
      data: {
        email: adminEmail,
        username: 'admin',
        firstName: 'Super',
        lastName: 'Admin',
        phone: faker.phone.number(),
        password,
        picture:
          'https://doodleipsum.com/700/avatar?i=bc3a7b2ecb91d1a6c511a620968c8a06',
      },
    });

    const adminRole = roleMap.get('admin');
    if (adminRole) {
      await prisma.userRole.create({
        data: {
          userId: adminUser.id,
          roleId: adminRole.id,
        },
      });
    }

    console.log('Default admin created:', adminEmail);
  } else {
    console.log('Admin already exists:', adminEmail);
  }
}

async function createFakeUsers(
  roleMap: Map<string, { id: string }>,
  password: string,
) {
  for (let i = 0; i < 20; i++) {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const email = faker.internet.email({ firstName, lastName });
    const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const roleName = roles[Math.floor(Math.random() * roles.length)].name;
    const role = roleMap.get(roleName);

    const user = await prisma.user.upsert({
      where: { email },
      update: {},
      create: {
        email,
        username,
        firstName,
        lastName,
        googleId: `${username}-google-id`,
        phone: faker.phone.number(),
        password,
        picture:
          'https://doodleipsum.com/700/avatar?i=bc3a7b2ecb91d1a6c511a620968c8a06',
      },
    });

    if (role) {
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: role.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: role.id,
        },
      });
    }
  }

  console.log('20 fake users created.');
}

async function seedCategories() {
  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }
  console.log('Categories seeded.');
}

async function createFakeProducts() {
  const categories = await prisma.category.findMany();
  const users = await prisma.user.findMany();
  const statuses = ['In Stock', 'Low Stock', 'Out of Stock'] as const;

  if (!categories.length || !users.length) {
    return;
  }

  for (let i = 0; i < 50; i++) {
    const randomCategory =
      categories[Math.floor(Math.random() * categories.length)];
    const randomAuthor = users[Math.floor(Math.random() * users.length)];
    type Status = (typeof statuses)[number];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

    await prisma.product.create({
      data: {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        image: faker.image.url(),
        isActive: faker.datatype.boolean(),
        stock: 1000,
        categoryId: randomCategory.id,
        authorId: randomAuthor.id,
        status: randomStatus,
      },
    });
  }

  console.log('50 fake products created.');
}

// ==== RUN ====
async function main() {
  const password = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || 'admin123',
    10,
  );

  const roleMap = await seedRoles();
  const groupMap = await seedPermissionGroups();
  const permissions = await seedPermissions(groupMap);
  await assignPermissionsToRoles(roleMap, permissions);
  await createAdminUser(roleMap, password);
  await createFakeUsers(roleMap, password);
  await seedCategories();
  await createFakeProducts();
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
