"use client";

import {
  Card,
  Group,
  Text,
  Image,
  Badge,
  Stack,
  Button,
  Box,
  Divider,
} from "@mantine/core";
import { IconTruck } from "@tabler/icons-react";

// Mock Data
const mockOrders = [
  {
    id: "#ORD-2025-001",
    date: "25/11/2025",
    total: "14.700.000đ",
    status: "delivered",
    statusLabel: "Giao thành công",
    color: "green",
    items: [
      {
        name: "Ghế Công Thái Học ErgoChair Pro",
        image:
          "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=200&q=80",
      },
      {
        name: "Bàn Nâng Hạ SmartDesk 2",
        image:
          "https://images.unsplash.com/photo-1499933374294-4584851497cc?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "#ORD-2025-009",
    date: "20/11/2025",
    total: "950.000đ",
    status: "shipping",
    statusLabel: "Đang vận chuyển",
    color: "blue",
    items: [
      {
        name: "Đèn Treo Màn Hình ScreenBar",
        image:
          "https://ecodigital.vn/wp-content/uploads/2022/07/yeelight-smart-led-monitor-light-bar-pro-8-1.jpg",
      },
    ],
  },
];

export default function OrdersPage() {
  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Text fw={700} size="xl">
          Đơn hàng của tôi
        </Text>
      </Group>

      {mockOrders.map((order) => (
        <Card key={order.id} withBorder shadow="sm" radius="lg">
          {/* HEADER */}
          <Group justify="space-between" align="start" mb="md">
            <Box>
              <Group gap={10} mb={5}>
                <Text fw={700} size="lg">
                  {order.id}
                </Text>
                <Badge color={order.color} variant="light">
                  {order.statusLabel}
                </Badge>
              </Group>
              <Text size="sm" c="dimmed">
                Đặt ngày: {order.date}
              </Text>
            </Box>

            <Text fw={700} size="lg">
              {order.total}
            </Text>
          </Group>

          <Divider mb="md" />

          {/* ORDER ITEMS */}
          <Stack gap="md">
            {order.items.map((item, idx) => (
              <Group key={idx} gap="md" wrap="nowrap">
                <Image
                  src={item.image}
                  alt={item.name}
                  w={64}
                  h={64}
                  radius="md"
                  fit="cover"
                />

                <Box flex="1">
                  <Text fw={500} lineClamp={1}>
                    {item.name}
                  </Text>
                  <Text size="sm" c="dimmed">
                    Phân loại: Mặc định
                  </Text>
                </Box>

                <Button variant="subtle" visibleFrom="sm">
                  Mua lại
                </Button>
              </Group>
            ))}
          </Stack>

          <Divider my="md" />

          {/* FOOTER ACTIONS */}
          <Group justify="end" gap="sm">
            <Button variant="default">Chi tiết đơn</Button>

            {order.status === "shipping" && (
              <Button
                leftSection={<IconTruck size={16} />}
                color="dark"
                variant="filled"
              >
                Theo dõi
              </Button>
            )}
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
