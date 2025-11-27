"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Box, Center, Loader, Text, Stack, Title, Alert } from "@mantine/core";
import { IconAlertCircle, IconCircleCheck } from "@tabler/icons-react";
import { unitOfWork } from "@/services/di/unit-of-work";

const OAuthCallbackContent = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState<string>("Đang xử lý đăng nhập...");

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // 1. Kiểm tra lỗi từ IdP
                const error = searchParams.get("error");
                const errorDescription = searchParams.get("error_description");

                if (error) {
                    console.error("OAuth error:", error, errorDescription);
                    setStatus("error");
                    setMessage(errorDescription || "Đăng nhập thất bại. Vui lòng thử lại.");
                    // setTimeout(() => router.push("/auth"), 3000);
                    return;
                }

                // 2. Lấy authorization code
                const code = searchParams.get("code");
                const state = searchParams.get("state");

                if (!code) {
                    console.error("No authorization code received");
                    setStatus("error");
                    setMessage("Không nhận được mã xác thực. Vui lòng thử lại.");
                    // setTimeout(() => router.push("/auth"), 3000);
                    return;
                }

                console.log("✅ Received authorization code:", code);

                // 3. Exchange code for tokens qua NestJS backend
                setMessage("Đang xác thực với server...");

                // const newCode = code + "X";

                const loginData = await unitOfWork.authenticationService.userLoginOauth(code);
                console.log("✅ Login data:", loginData);

                if (!loginData || !loginData.accessToken) {
                    console.error("Failed to get tokens from backend");
                    setStatus("error");
                    setMessage("Không thể lấy token từ server. Vui lòng thử lại.");
                    // setTimeout(() => router.push("/auth"), 3000);
                    return;
                }

                console.log("✅ Successfully got tokens:", {
                    hasAccessToken: !!loginData.accessToken,
                    hasRefreshToken: !!loginData.refreshToken,
                    userInfo: loginData.userInfo,
                });

                // 4. Đăng nhập thành công
                setStatus("success");
                setMessage("Đăng nhập thành công! Đang chuyển hướng...");

                // 5. Redirect to home
                setTimeout(() => {
                    router.push("/");
                }, 1500);

            } catch (error) {
                console.error("❌ Callback error:", error);
                setStatus("error");

                let errorMessage = "Có lỗi xảy ra. Vui lòng thử lại.";

                if (error instanceof Error) {
                    errorMessage = error.message;
                }

                setMessage(errorMessage);
                // setTimeout(() => router.push("/auth"), 3000);
            }
        };

        handleCallback();
    }, [searchParams, router]);

    return (
        <Box h="100vh" w="100vw" style={{ overflow: "hidden", backgroundColor: "#f8f9fa" }}>
            <Center h="100%">
                <Stack align="center" gap="xl" maw={500} p="xl">
                    {status === "loading" && (
                        <>
                            <Loader size="xl" color="blue" />
                            <Title order={2} ta="center">
                                {message}
                            </Title>
                            <Text c="dimmed" size="sm" ta="center">
                                Vui lòng đợi trong giây lát...
                            </Text>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <IconCircleCheck size={80} color="green" stroke={1.5} />
                            <Title order={2} ta="center" c="green">
                                {message}
                            </Title>
                            <Text c="dimmed" size="sm" ta="center">
                                Bạn sẽ được chuyển đến trang chủ...
                            </Text>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <IconAlertCircle size={80} color="red" stroke={1.5} />
                            <Alert
                                icon={<IconAlertCircle size={16} />}
                                title="Lỗi đăng nhập"
                                color="red"
                                variant="light"
                            >
                                {message}
                            </Alert>
                            <Text c="dimmed" size="sm" ta="center">
                                Sẽ tự động chuyển về trang đăng nhập sau 3 giây...
                            </Text>
                        </>
                    )}
                </Stack>
            </Center>
        </Box>
    );
};

const OAuthCallbackPage = () => {
    return (
        <Suspense
            fallback={
                <Box h="100vh" w="100vw" style={{ overflow: "hidden", backgroundColor: "#f8f9fa" }}>
                    <Center h="100%">
                        <Stack align="center" gap="md">
                            <Loader size="xl" color="blue" />
                            <Title order={3}>Đang tải...</Title>
                        </Stack>
                    </Center>
                </Box>
            }
        >
            <OAuthCallbackContent />
        </Suspense>
    );
};

export default OAuthCallbackPage;