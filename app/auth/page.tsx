"use client";

import { useState } from "react";
import {
  Anchor,
  Button,
  Checkbox,
  Divider,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
  ThemeIcon,
  Group,
  Box,
  Flex,
  Center,
  Loader,
} from "@mantine/core";
import {
  IconLock,
  IconShieldLock,
  IconDeviceDesktop,
  IconAt,
  IconArrowLeft,
} from "@tabler/icons-react";
import Link from "next/link";
import { unitOfWork } from "@/services/di/unit-of-work";

// URL ảnh setup
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80";

const LoginPage = () => {
  const [isOAuthLoading, setIsOAuthLoading] = useState(false);

  const handleOAuthLogin = () => {
    setIsOAuthLoading(true);
    try {
      unitOfWork.authenticationService.initiateOAuthLogin();
    } catch (error) {
      console.error("Failed to initiate OAuth login:", error);
      setIsOAuthLoading(false);
    }
  };
  return (
    // CONTAINER TỔNG:
    // 1. h="100vh": Chiều cao bằng đúng màn hình thiết bị
    // 2. w="100vw": Chiều rộng bằng đúng màn hình thiết bị
    // 3. overflow="hidden": Cắt bỏ mọi phần thừa, chặn thanh cuộn
    <Box h="100vh" w="100vw" style={{ overflow: "hidden" }}>
      {/* Dùng FLEX thay vì GRID để kiểm soát chiều cao tốt hơn */}
      <Flex h="100%" direction={{ base: "column", md: "row" }}>
        {/* --- CỘT TRÁI: FORM (Width tự chỉnh theo màn hình) --- */}
        <Box
          h="100%"
          w={{ base: "100%", md: "50%", lg: "40%" }} // Mobile: 100%, Desktop: 50% hoặc 40%
          bg="gray.0"
          style={{ overflowY: "auto" }} // Cho phép cuộn riêng phần form nếu màn hình quá thấp
        >
          {/* Center nội dung theo chiều dọc thủ công bằng Flex */}
          <Flex
            h="100%"
            direction="column"
            align="center"
            justify="center"
            p="xl"
          >
            <Box w="100%" maw={420}>
              {/* Branding */}
              <Stack align="start" mb={30}>
                <Link href="/" style={{ textDecoration: "none" }}>
                  <Group gap="xs" style={{ cursor: "pointer" }}>
                    <ThemeIcon
                      color="dark"
                      variant="filled"
                      radius="md"
                      size="lg"
                    >
                      <IconDeviceDesktop size={20} />
                    </ThemeIcon>
                    <Text fw={900} size="xl" c="dark">
                      ZenSpace
                    </Text>
                  </Group>
                </Link>

                <Title order={2} mt="md" fw={900}>
                  Chào mừng trở lại
                </Title>
                <Text c="dimmed">
                  Đăng nhập để quản lý không gian ZenSpace của bạn
                </Text>
              </Stack>

              {/* Form */}
              <Paper withBorder shadow="sm" p={30} radius="md" bg="white">
                <Stack gap="md">
                  <TextInput
                    label="Email hoặc Tên đăng nhập"
                    leftSection={<IconAt size={16} />}
                    radius="md"
                    required
                    error=""
                  />
                  <PasswordInput
                    label="Mật khẩu"
                    leftSection={<IconLock size={16} />}
                    radius="md"
                    required
                    error=""
                  />

                  <Group justify="space-between" mt="xs">
                    <Checkbox
                      label="Ghi nhớ đăng nhập"
                      color="dark"
                      size="sm"
                    />
                    <Anchor
                      component={Link}
                      href="/forgot-password"
                      size="sm"
                      c="dimmed"
                    >
                      Quên mật khẩu?
                    </Anchor>
                  </Group>

                  <Button fullWidth color="dark" radius="md" mt="xs">
                    Đăng nhập
                  </Button>
                </Stack>

                <Divider label="Hoặc" labelPosition="center" my="lg" />

                <Button
                  fullWidth
                  variant="default"
                  radius="md"
                  style={{ border: "1px solid blue" }}
                  leftSection={
                    isOAuthLoading ? (
                      <Loader size="xs" color="#228be6" />
                    ) : (
                      <IconShieldLock size={20} color="#228be6" />
                    )
                  }
                  onClick={handleOAuthLogin}
                  loading={isOAuthLoading}
                  disabled={isOAuthLoading}
                >
                  {isOAuthLoading ? "Đang chuyển hướng..." : "Tiếp tục với WiFaKey"}
                </Button>
              </Paper>

              <Text ta="center" mt="xl" size="sm">
                Chưa có tài khoản?{" "}
                <Anchor component={Link} href="/register" fw={700} c="dark">
                  Đăng ký ngay
                </Anchor>
              </Text>

              <Center mt="lg">
                <Anchor component={Link} href="/" c="dimmed" size="sm">
                  <Group gap={5}>
                    <IconArrowLeft size={14} /> Quay lại trang chủ
                  </Group>
                </Anchor>
              </Center>
            </Box>
          </Flex>
        </Box>

        {/* --- CỘT PHẢI: ẢNH (Chiếm hết phần còn lại) --- */}
        <Box
          visibleFrom="md" // Ẩn trên mobile
          style={{ flex: 1 }} // Tự động chiếm hết không gian còn lại (quan trọng)
          h="100%"
        >
          <Box
            h="100%"
            style={{
              backgroundImage: `url(${HERO_IMAGE})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              position: "relative",
            }}
          >
            <Box
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            />
            <Stack
              justify="end"
              h="100%"
              p={60}
              style={{ position: "relative", zIndex: 2 }}
            >
              <Title
                c="white"
                order={1}
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                &quot;Không gian tối giản,
                <br />
                Hiệu suất tối đa.&quot;
              </Title>
              <Text
                c="white"
                size="lg"
                fw={500}
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                Khám phá bộ sưu tập ZenSpace 2025.
              </Text>
            </Stack>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
};

export default LoginPage;
