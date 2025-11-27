"use client";

import React from "react";
import {
  Card,
  Text,
  Title,
  PasswordInput,
  Button,
  Group,
  Stack,
  Divider,
} from "@mantine/core";
import { IconLock } from "@tabler/icons-react";

export default function SecurityPage() {
  return (
    <Card shadow="sm" padding="lg" radius="lg" withBorder>
      {/* Header */}
      <Stack gap={4} mb="lg">
        <Title order={3}>Đổi mật khẩu</Title>
        <Text size="sm" c="dimmed">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
        </Text>
      </Stack>

      <Divider mb="lg" />

      <Stack maw={400} gap="md">
        {/* Current password */}
        <PasswordInput
          label="Mật khẩu hiện tại"
          placeholder="Nhập mật khẩu hiện tại"
          leftSection={<IconLock size={16} />}
          radius="md"
          size="md"
        />

        {/* New password */}
        <PasswordInput
          label="Mật khẩu mới"
          placeholder="Nhập mật khẩu mới"
          leftSection={<IconLock size={16} />}
          radius="md"
          size="md"
        />

        {/* Confirm new password */}
        <PasswordInput
          label="Nhập lại mật khẩu mới"
          placeholder="Nhập lại mật khẩu mới"
          leftSection={<IconLock size={16} />}
          radius="md"
          size="md"
        />

        {/* Action buttons */}
        <Group justify="space-between" mt="sm">
          <Button color="dark" radius="md" size="md">
            Cập nhật
          </Button>

          <Button
            variant="subtle"
            color="gray"
            size="sm"
            component="a"
            href="/forgot-password"
          >
            Quên mật khẩu?
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
