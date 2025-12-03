"use client";

import { unitOfWork } from "@/services/di/unit-of-work";
import React, { useEffect, useState } from "react";

export interface UserInfoResponse {
  success: boolean;
  data: UserInfo;
}

export interface UserInfo {
  id: string;
  idpUserId: string;
  name: string;
  email: string | null;
  picture: string | null;
  roles: string[];
  preferences: Record<string, unknown>;
  createdAt: string; // ISO date string
  lastLoginAt: string; // ISO date string
  lastLogoutAt: string | null;
}

export default function GeneralProfilePage() {
  const [userInfo, setUserInfo] = useState<UserInfo>();

  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await unitOfWork.userService.getCurrentUser();

        if (response) {
          console.log(response);
          setUserInfo(response.data);
        }
      } catch (error) {
        console.log(error);
      }
    };

    getUserInfo();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
      <div className="border-b border-gray-200 pb-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Thông tin cá nhân</h2>
        <p className="text-gray-500 text-sm mt-1">
          Quản lý thông tin hồ sơ của bạn
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Họ và tên</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
            value={userInfo?.name}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Tên hiển thị
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
            value={userInfo?.name}
          />
        </div>
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            defaultValue="zen@example.com"
            disabled
            className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg cursor-not-allowed"
          />
          <p className="text-xs text-gray-400">
            Liên hệ CSKH để thay đổi email
          </p>
        </div> */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Số điện thoại
          </label>
          <input
            type="tel"
            defaultValue="0909 123 456"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition"
          />
        </div> */}
        {/* <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Giới tính</label>
          <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none transition bg-white">
            <option>Nam</option>
            <option>Nữ</option>
            <option>Khác</option>
          </select>
        </div> */}
      </div>

      <div className="mt-8 flex justify-end space-x-4">
        <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition">
          Hủy
        </button>
        <button className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium transition shadow-lg shadow-gray-900/20">
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}
