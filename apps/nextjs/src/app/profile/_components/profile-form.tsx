"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/utils/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Enums } from "@acme/db";

const FIELD_LABELS = {
  [Enums.ProfessionalField.DEVELOPMENT]: "开发",
  [Enums.ProfessionalField.PRODUCT]: "产品",
  [Enums.ProfessionalField.DESIGN]: "设计",
  [Enums.ProfessionalField.OPERATIONS]: "运营",
  [Enums.ProfessionalField.HARDWARE]: "硬件",
  [Enums.ProfessionalField.SALES]: "销售",
  [Enums.ProfessionalField.RESEARCH]: "研究",
  [Enums.ProfessionalField.MEDIA]: "媒体",
  [Enums.ProfessionalField.CONSULTING]: "咨询",
  [Enums.ProfessionalField.INVESTMENT]: "投资",
  [Enums.ProfessionalField.STUDENT]: "学生",
  [Enums.ProfessionalField.ART]: "艺术",
  [Enums.ProfessionalField.LEGAL]: "法务",
  [Enums.ProfessionalField.TEACHING]: "教师",
  [Enums.ProfessionalField.OTHER]: "其他",
};

const STATUS_LABELS = {
  [Enums.UserStatus.EMPLOYED]: "在职",
  [Enums.UserStatus.STARTUP]: "创业",
  [Enums.UserStatus.FREELANCE]: "自由",
  [Enums.UserStatus.JOB_SEEKING]: "求职",
  [Enums.UserStatus.STUDENT]: "在校",
  [Enums.UserStatus.OTHER]: "其他",
};

const GENDER_LABELS = {
  [Enums.Gender.MALE]: "男",
  [Enums.Gender.FEMALE]: "女",
  [Enums.Gender.OTHER]: "其他",
};

export function ProfileForm() {
  const router = useRouter();
  const { data: profile, isLoading } = api.profile.get.useQuery();
  const { mutate: updateProfile } = api.profile.update.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });

  const [formData, setFormData] = useState({
    realName: profile?.realName ?? "",
    phoneNumber: profile?.phoneNumber ?? "",
    nickname: profile?.nickname ?? "",
    wechat: profile?.wechat ?? "",
    selfIntro: profile?.selfIntro ?? "",
    gender: profile?.gender ?? "",
    occupation: profile?.occupation ?? "",
    field: profile?.field ?? "",
    status: profile?.status ?? "",
    resources: profile?.resources ?? "",
    helpNeeded: profile?.helpNeeded ?? "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      realName: formData.realName,
      phoneNumber: formData.phoneNumber || undefined,
      nickname: formData.nickname || undefined,
      wechat: formData.wechat || undefined,
      selfIntro: formData.selfIntro || undefined,
      gender: formData.gender as typeof Enums.Gender[keyof typeof Enums.Gender] | undefined,
      occupation: formData.occupation || undefined,
      field: formData.field as typeof Enums.ProfessionalField[keyof typeof Enums.ProfessionalField] | undefined,
      status: formData.status as typeof Enums.UserStatus[keyof typeof Enums.UserStatus] | undefined,
      resources: formData.resources || undefined,
      helpNeeded: formData.helpNeeded || undefined,
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">基本信息</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="realName">真实姓名</Label>
                <Input
                  id="realName"
                  name="realName"
                  value={formData.realName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nickname">昵称</Label>
                <Input
                  id="nickname"
                  name="nickname"
                  value={formData.nickname}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">手机号码</Label>
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="wechat">微信</Label>
                <Input
                  id="wechat"
                  name="wechat"
                  value={formData.wechat}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="selfIntro">自我介绍</Label>
              <Textarea
                id="selfIntro"
                name="selfIntro"
                value={formData.selfIntro}
                onChange={handleInputChange}
                className="h-24"
              />
            </div>
          </div>

          {/* Professional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">职业信息</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="gender">性别</Label>
                <Select
                  name="gender"
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, gender: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择性别" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(GENDER_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="occupation">职业</Label>
                <Input
                  id="occupation"
                  name="occupation"
                  value={formData.occupation}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="field">职业领域</Label>
                <Select
                  name="field"
                  value={formData.field}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, field: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择职业领域" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(FIELD_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">目前状态</Label>
                <Select
                  name="status"
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="选择目前状态" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">附加信息</h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resources">可提供的资源</Label>
                <Textarea
                  id="resources"
                  name="resources"
                  value={formData.resources}
                  onChange={handleInputChange}
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="helpNeeded">需要的帮助</Label>
                <Textarea
                  id="helpNeeded"
                  name="helpNeeded"
                  value={formData.helpNeeded}
                  onChange={handleInputChange}
                  className="h-24"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <Button type="submit">保存信息</Button>
        </div>
      </Card>
    </form>
  );
}
