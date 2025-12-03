"use client";

import { useAuth } from "@/hooks/use-auth";
import { unitOfWork } from "@/services/di/unit-of-work";
import { Button, Container, Loader, Title } from "@mantine/core";
import { useState } from "react";

const RefreshPage = () => {
  const { loginData } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleRefreshToken = async () => {
    if (!loginData?.refreshToken) {
      alert("Vui lòng đăng nhập để có refresh token!!!");
      return;
    }
    try {
      setIsLoading(true);
      const response = await unitOfWork.authenticationService.refreshToken(
        loginData.refreshToken
      );

      if (response) {
        console.log(response);
        alert("Nhận Access Token mới thành công!");
      }
      else alert("Nhận Access Token thất bại!");
    } catch (error) {
      console.log("Get Access Token falied: ", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Container
      size="lg"
      className="h-screen justify-center items-center flex flex-col"
    >
      <Title fw={500} mb="md">
        Nhận Access Token mới từ Refresh Token
      </Title>
      <Button
        loading={isLoading}
        leftSection={isLoading ? <Loader size="xs" /> : null}
        onClick={handleRefreshToken}
      >
        Nhận Access Token
      </Button>
    </Container>
  );
};

export default RefreshPage;
