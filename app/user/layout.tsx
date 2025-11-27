"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  AppShell,
  Avatar,
  Card,
  Stack,
  Group,
  Text,
  Button,
  NavLink,
  Burger,
  Box,
  Badge,
  Container,
  ThemeIcon,
  Title,
  ActionIcon,
  Indicator,
  Menu,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconUser,
  IconShoppingBag,
  IconMapPin,
  IconLock,
  IconCamera,
  IconLogout,
  IconDeviceDesktop,
  IconSearch,
  IconSettings,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [opened, { toggle }] = useDisclosure();
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Thông tin tài khoản", href: "/user", icon: IconUser },
    { label: "Lịch sử đơn hàng", href: "/user/orders", icon: IconShoppingBag },
    { label: "Sổ địa chỉ", href: "/user/address", icon: IconMapPin },
    { label: "Đổi mật khẩu", href: "/user/security", icon: IconLock },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 260,
        breakpoint: "md",
        collapsed: { mobile: !opened },
      }}
      padding="lg"
    >
      {/* HEADER */}
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            {/* Logo & Menu */}
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="md"
                size="sm"
              />
              <Group gap={6} visibleFrom="xs" style={{ cursor: "pointer" }}>
                <ThemeIcon color="dark" variant="filled" radius="md" size="lg">
                  <IconDeviceDesktop size={20} />
                </ThemeIcon>
                <Title order={3}>ZenSpace</Title>
              </Group>
            </Group>

            {/* Navigation (Desktop) */}
            <Group gap="xl" visibleFrom="sm">
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                }}
              >
                Sản phẩm
              </Link>
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                }}
              >
                Setup mẫu
              </Link>
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                }}
              >
                Blog
              </Link>
              <Link
                href="#"
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  fontWeight: 500,
                }}
              >
                Về chúng tôi
              </Link>
            </Group>

            {/* Actions */}
            <Group>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="lg"
                visibleFrom="xs"
              >
                <IconSearch size={22} stroke={1.5} />
              </ActionIcon>
              <Indicator label="0" size={16} color="dark" offset={4}>
                <ActionIcon variant="subtle" color="gray" size="lg">
                  <IconShoppingBag size={22} stroke={1.5} />
                </ActionIcon>
              </Indicator>
              {/* --- PHẦN NÚT ĐĂNG NHẬP / ĐĂNG KÝ Ở ĐÂY --- */}
              {isAuthenticated ? (
                // TRƯỜNG HỢP ĐÃ ĐĂNG NHẬP: Hiện Avatar Menu
                <Menu shadow="md" width={200} position="bottom-end">
                  <Menu.Target>
                    <Avatar
                      src="https://tse4.mm.bing.net/th/id/OIP.GLFqmenTxi6LaSfeIO8f2AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                      alt="User"
                      radius="xl"
                      size="md"
                      style={{ cursor: "pointer" }}
                    >
                      <IconUser size={20} />
                    </Avatar>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Label>Tài khoản</Menu.Label>
                    <Menu.Item
                      leftSection={<IconSettings size={14} />}
                      onClick={() => router.push("/user")}
                    >
                      Cài đặt
                    </Menu.Item>
                    <Menu.Item leftSection={<IconShoppingBag size={14} />}>
                      Đơn hàng
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      leftSection={<IconLogout size={14} />}
                      onClick={logout}
                    >
                      Đăng xuất
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              ) : (
                // TRƯỜNG HỢP KHÁCH: Hiện nút Đăng nhập/Đăng ký
                <Group visibleFrom="sm" ml="xs">
                  <Button
                    component={Link}
                    href="/auth"
                    variant="default"
                    radius="md"
                  >
                    Đăng nhập
                  </Button>
                  <Button component={Link} href="/" color="dark" radius="md">
                    Đăng ký
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        <Stack>
          {/* USER CARD */}
          <Card shadow="sm" radius="lg" padding="lg" withBorder>
            <Stack align="center" gap="xs">
              <Box pos="relative">
                <Avatar
                  radius="50%"
                  src="https://tse4.mm.bing.net/th/id/OIP.GLFqmenTxi6LaSfeIO8f2AHaHa?rs=1&pid=ImgDetMain&o=7&rm=3"
                  size={96}
                />

                {/* Avatar edit icon */}
                <Button
                  size="xs"
                  radius="xl"
                  pos="absolute"
                  bottom={-5}
                  right={-5}
                  variant="filled"
                  color="dark"
                  p={6}
                >
                  <IconCamera size={14} />
                </Button>
              </Box>

              <Text fw={700} size="lg">
                Nguyễn Văn A
              </Text>

              <Text size="sm" c="dimmed">
                zen@example.com
              </Text>

              <Badge color="yellow" variant="light">
                Thành viên Vàng
              </Badge>
            </Stack>
          </Card>

          {/* NAVIGATION */}
          <Stack mt="md">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                component={Link}
                href={item.href}
                label={item.label}
                leftSection={<item.icon size={18} />}
                active={pathname === item.href}
                variant="light"
                styles={{
                  root: {
                    borderRadius: 10,
                  },
                }}
              />
            ))}

            {/* LOGOUT */}
            <Button
              variant="light"
              color="red"
              leftSection={<IconLogout size={18} />}
              radius="md"
              mt="sm"
            >
              Đăng xuất
            </Button>
          </Stack>
        </Stack>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
