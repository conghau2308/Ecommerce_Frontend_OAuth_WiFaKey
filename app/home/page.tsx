"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  AppShell,
  Container,
  Group,
  Burger,
  Title,
  Text,
  Button,
  Image,
  SimpleGrid,
  Card,
  Badge,
  ActionIcon,
  Stack,
  TextInput,
  Indicator,
  ThemeIcon,
  rem,
  Paper,
  Box,
  Menu,
  Avatar,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconSearch,
  IconShoppingBag,
  IconHeart,
  IconArmchair,
  IconDeviceDesktop,
  IconLamp,
  IconKeyboard,
  IconTruckDelivery,
  IconShieldCheck,
  IconArrowRight,
  IconSettings,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import Link from "next/link";

// --- MOCK DATA: SẢN PHẨM SETUP ---
const products = [
  {
    id: 1,
    title: "Ghế Công Thái Học ErgoChair Pro",
    category: "Ghế",
    price: "8.500.000đ",
    image:
      "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80",
    isNew: true,
  },
  {
    id: 2,
    title: "Bàn Nâng Hạ SmartDesk 2",
    category: "Bàn",
    price: "6.200.000đ",
    image:
      "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=600&q=80",
    isNew: false,
  },
  {
    id: 3,
    title: "Keychron Q1 Pro Custom",
    category: "Bàn phím",
    price: "4.100.000đ",
    image:
      "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=600&q=80",
    isNew: true,
  },
  {
    id: 4,
    title: "Đèn Treo Màn Hình ScreenBar",
    category: "Ánh sáng",
    price: "950.000đ",
    image:
      "https://ecodigital.vn/wp-content/uploads/2022/07/yeelight-smart-led-monitor-light-bar-pro-8-1.jpg",
    isNew: false,
  },
];

// --- MOCK DATA: DANH MỤC ---
const categories = [
  { label: "Ghế Ergonomic", icon: IconArmchair, color: "teal" },
  { label: "Setup PC", icon: IconDeviceDesktop, color: "blue" },
  { label: "Ánh sáng", icon: IconLamp, color: "yellow" },
  { label: "Phụ kiện", icon: IconKeyboard, color: "grape" },
];

export default function HomePage() {
  const [opened, { toggle }] = useDisclosure();
  const { isAuthenticated, logout } = useAuth();

  return (
    <AppShell
      header={{ height: 70 }}
      padding={0} // Full width design
    >
      {/* --- HEADER --- */}
      <AppShell.Header>
        <Container size="xl" h="100%">
          <Group h="100%" justify="space-between">
            {/* Logo & Menu */}
            <Group>
              <Burger
                opened={opened}
                onClick={toggle}
                hiddenFrom="sm"
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
                    <Menu.Item leftSection={<IconSettings size={14} />}>
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
                  <Button
                    component={Link}
                    href="/"
                    color="dark"
                    radius="md"
                  >
                    Đăng ký
                  </Button>
                </Group>
              )}
            </Group>
          </Group>
        </Container>
      </AppShell.Header>

      <AppShell.Main>
        {/* --- HERO SECTION (Full Width) --- */}
        <Box bg="gray.1" py={80}>
          <Container size="xl">
            <SimpleGrid
              cols={{ base: 1, md: 2 }}
              spacing={40}
              verticalSpacing={40}
            >
              <Stack justify="center" gap="lg">
                <Badge variant="light" color="dark" size="lg">
                  New Arrival 2025
                </Badge>
                <Title style={{ fontSize: rem(48), lineHeight: 1.2 }}>
                  Tối giản không gian, <br />
                  <Text span c="dimmed" inherit>
                    Tối ưu hiệu suất.
                  </Text>
                </Title>
                <Text size="lg" c="dimmed" maw={500}>
                  Khám phá bộ sưu tập ZenSpace - Nơi công nghệ gặp gỡ nghệ thuật
                  sắp đặt. Biến góc làm việc của bạn thành nơi khơi nguồn cảm
                  hứng.
                </Text>
                <Group mt="md">
                  <Button size="xl" color="dark" radius="md">
                    Mua ngay
                  </Button>
                  <Button
                    size="xl"
                    variant="default"
                    radius="md"
                    leftSection={<IconArrowRight size={18} />}
                  >
                    Xem Gallery
                  </Button>
                </Group>

                {/* Trust Badges */}
                <Group mt="xl" gap="xl">
                  <Group gap="xs">
                    <IconTruckDelivery size={20} />
                    <Text size="sm" fw={500}>
                      Free Ship {">"} 1tr
                    </Text>
                  </Group>
                  <Group gap="xs">
                    <IconShieldCheck size={20} />
                    <Text size="sm" fw={500}>
                      Bảo hành 2 năm
                    </Text>
                  </Group>
                </Group>
              </Stack>

              {/* Hero Image */}
              <Image
                src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1000&q=80"
                radius="md"
                h={500}
                w="100%"
                fit="cover"
                alt="Minimal workspace"
                style={{ boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
              />
            </SimpleGrid>
          </Container>
        </Box>

        {/* --- CATEGORIES --- */}
        <Container size="xl" py={60}>
          <Title order={2} mb="xl" ta="center">
            Khám phá theo danh mục
          </Title>
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
            {categories.map((cat) => (
              <Paper
                key={cat.label}
                p="xl"
                radius="md"
                withBorder
                style={{ cursor: "pointer", transition: "transform 0.2s" }}
                // Hover effect
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <Stack align="center" gap="xs">
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    variant="light"
                    color={cat.color}
                  >
                    <cat.icon size={32} stroke={1.5} />
                  </ThemeIcon>
                  <Text fw={600}>{cat.label}</Text>
                </Stack>
              </Paper>
            ))}
          </SimpleGrid>
        </Container>

        {/* --- TRENDING PRODUCTS --- */}
        <Container size="xl" py={40}>
          <Group justify="space-between" mb="xl" align="end">
            <Title order={2}>Sản phẩm nổi bật</Title>
            <Button
              variant="subtle"
              color="dark"
              rightSection={<IconArrowRight size={16} />}
            >
              Xem tất cả
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="xl">
            {products.map((item) => (
              <Card
                key={item.id}
                padding="lg"
                radius="md"
                withBorder
                shadow="sm"
              >
                <Card.Section>
                  <Image
                    src={item.image}
                    height={240}
                    alt={item.title}
                    fit="cover"
                  />
                </Card.Section>

                <Group justify="space-between" mt="md" mb="xs">
                  <Text fw={500} c="dimmed" size="xs" tt="uppercase">
                    {item.category}
                  </Text>
                  {item.isNew && (
                    <Badge color="green" variant="light">
                      Mới
                    </Badge>
                  )}
                </Group>

                <Text fw={700} size="lg" lineClamp={1}>
                  {item.title}
                </Text>
                <Text mt="xs" c="dark" fw={600} size="xl">
                  {item.price}
                </Text>

                <Button
                  color="dark"
                  fullWidth
                  mt="md"
                  radius="md"
                  variant="light"
                >
                  Thêm vào giỏ
                </Button>

                <ActionIcon
                  variant="transparent"
                  color="gray"
                  pos="absolute"
                  top={10}
                  right={10}
                  style={{ backgroundColor: "white" }}
                >
                  <IconHeart size={20} />
                </ActionIcon>
              </Card>
            ))}
          </SimpleGrid>
        </Container>

        {/* --- PROMO BANNER --- */}
        <Container size="xl" my={80}>
          <Card radius="lg" padding={50} bg="dark" c="white">
            <Group justify="space-between" align="center">
              <Stack gap="xs">
                <Title order={2}>Setup Dream Desk của bạn ngay hôm nay</Title>
                <Text c="gray.4">
                  Nhập mã ZENSPACE giảm ngay 10% cho đơn hàng đầu tiên.
                </Text>
              </Stack>
              <Button size="lg" variant="white" color="dark">
                Lấy mã ngay
              </Button>
            </Group>
          </Card>
        </Container>

        {/* --- FOOTER --- */}
        <Box bg="gray.0" py={60} mt={80}>
          <Container size="xl">
            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing={50}>
              <Stack>
                <Title order={3}>ZenSpace</Title>
                <Text size="sm" c="dimmed" maw={300}>
                  Chúng tôi cung cấp giải pháp không gian làm việc tối giản giúp
                  bạn tập trung và sáng tạo hơn.
                </Text>
              </Stack>
              <Stack>
                <Text fw={700}>Liên kết</Text>
                <Text size="sm">Chính sách bảo hành</Text>
                <Text size="sm">Hướng dẫn setup</Text>
                <Text size="sm">Showroom</Text>
              </Stack>
              <Stack>
                <Text fw={700}>Đăng ký nhận tin</Text>
                <Group gap={0}>
                  <TextInput
                    placeholder="Email của bạn"
                    radius="md"
                    style={{ flex: 1 }}
                  />
                  <Button radius="md" color="dark">
                    Gửi
                  </Button>
                </Group>
              </Stack>
            </SimpleGrid>
            <Text ta="center" size="xs" c="dimmed" mt={60}>
              © 2025 ZenSpace. All rights reserved.
            </Text>
          </Container>
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
