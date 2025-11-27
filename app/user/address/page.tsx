"use client";

import React from "react";
import {
  Card,
  Text,
  Badge,
  Button,
  Group,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import { IconSettings, IconPencil, IconTrash } from "@tabler/icons-react";

const mockAddresses = [
  {
    id: 1,
    type: "Nhà riêng",
    name: "Nguyễn Văn Zen",
    phone: "0909 123 456",
    address: "P.205, Chung cư ZenTower, Quận 1, TP.HCM",
    isDefault: true,
  },
  {
    id: 2,
    type: "Công ty",
    name: "Nguyễn Văn Zen",
    phone: "0909 123 456",
    address: "Tòa nhà TechHub, Quận 3, TP.HCM",
    isDefault: false,
  },
];

export default function AddressPage() {
  return (
    <Card withBorder radius="lg" p="lg" shadow="sm">
      {/* HEADER */}
      <Group justify="space-between" mb="xl" align="center">
        <Text fw={700} size="xl">
          Sổ địa chỉ
        </Text>

        <Button
          variant="light"
          leftSection={<IconSettings size={16} />}
          color="dark"
        >
          Thêm địa chỉ mới
        </Button>
      </Group>

      {/* LIST ADDRESS */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {mockAddresses.map((addr) => (
          <Card
            key={addr.id}
            withBorder
            shadow="xs"
            radius="lg"
            p="lg"
            style={{ position: "relative" }}
          >
            <Stack gap="xs">
              {/* TYPE + DEFAULT */}
              <Group gap={8}>
                <Badge
                  color={addr.isDefault ? "dark" : "gray"}
                  variant={addr.isDefault ? "filled" : "outline"}
                >
                  {addr.type}
                </Badge>

                {addr.isDefault && (
                  <Text size="xs" c="green" fw={600}>
                    Mặc định
                  </Text>
                )}
              </Group>

              {/* USER INFO */}
              <Text fw={700}>{addr.name}</Text>
              <Text size="sm" c="dimmed">
                {addr.phone}
              </Text>
              <Text size="sm" lineClamp={2}>
                {addr.address}
              </Text>

              {/* ACTION BUTTONS */}
              <Group mt="md" justify="space-between">
                <Button
                  variant="outline"
                  color="gray"
                  leftSection={<IconPencil size={14} />}
                  fullWidth
                >
                  Sửa
                </Button>

                <Button
                  variant="light"
                  color="red"
                  leftSection={<IconTrash size={16} />}
                >
                  Xoá
                </Button>
              </Group>
            </Stack>
          </Card>
        ))}
      </SimpleGrid>
    </Card>
  );
}
