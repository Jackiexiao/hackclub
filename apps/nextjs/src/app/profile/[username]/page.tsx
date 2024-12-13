import * as React from "react";
import { notFound } from "next/navigation";
import { api } from "@/utils/api";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Github,
  Twitter,
  Linkedin,
  Globe,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import { type RouterOutputs } from "@/utils/api";

type Profile = RouterOutputs["profile"]["getByUsername"];

export default async function ProfilePage({
  params,
}: {
  params: { username: string };
}) {
  const profile = await api.profile.getByUsername.query({
    username: params.username,
  });

  if (!profile) {
    notFound();
  }

  const levelBadges = {
    0: { label: "新会员", color: "bg-gray-500" },
    1: { label: "活跃会员", color: "bg-blue-500" },
    2: { label: "MVP创造者", color: "bg-green-500" },
  } as const;

  return (
    <div className="container mx-auto py-10">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Info Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profile.image ?? ""} />
              <AvatarFallback>{profile.realName?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{profile.realName}</h1>
              {profile.nickname && (
                <p className="text-gray-500">{profile.nickname}</p>
              )}
              <Badge
                className={`${
                  levelBadges[profile.level as keyof typeof levelBadges]?.color ??
                  levelBadges[0].color
                }`}
              >
                {levelBadges[profile.level as keyof typeof levelBadges]?.label ??
                  levelBadges[0].label}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Contact Info Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">联系方式</h2>
          <div className="space-y-2">
            {profile.wechat && (
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-4 w-4" />
                <span>微信: {profile.wechat}</span>
              </div>
            )}
            {profile.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
            {profile.phoneNumber && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>电话: {profile.phoneNumber}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Professional Info Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">职业信息</h2>
          <div className="space-y-2">
            {profile.occupation && (
              <p>
                <span className="font-medium">职业:</span> {profile.occupation}
              </p>
            )}
            {profile.field && (
              <p>
                <span className="font-medium">领域:</span> {profile.field}
              </p>
            )}
            {profile.status && (
              <p>
                <span className="font-medium">状态:</span> {profile.status}
              </p>
            )}
          </div>
        </Card>

        {/* Bio Card */}
        <Card className="p-6">
          <h2 className="mb-4 text-xl font-semibold">关于我</h2>
          {profile.selfIntro && (
            <p className="whitespace-pre-wrap">{profile.selfIntro}</p>
          )}
        </Card>

        {/* Resources & Help Card */}
        {(profile.resources || profile.helpNeeded) && (
          <Card className="p-6">
            <h2 className="mb-4 text-xl font-semibold">资源与帮助</h2>
            {profile.resources && (
              <div className="mb-4">
                <h3 className="mb-2 font-medium">我可以提供:</h3>
                <p className="whitespace-pre-wrap">{profile.resources}</p>
              </div>
            )}
            {profile.helpNeeded && (
              <div>
                <h3 className="mb-2 font-medium">我需要帮助:</h3>
                <p className="whitespace-pre-wrap">{profile.helpNeeded}</p>
              </div>
            )}
          </Card>
        )}

        {/* Projects Card */}
        {profile.projects && profile.projects.length > 0 && (
          <Card className="col-span-2 p-6">
            <h2 className="mb-4 text-xl font-semibold">项目</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {profile.projects.map((project) => (
                <Card key={project.id} className="overflow-hidden">
                  {project.imageUrl && (
                    <img
                      src={project.imageUrl}
                      alt={project.name}
                      className="h-48 w-full object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="mb-2 font-semibold">{project.name}</h3>
                    <p className="mb-2 text-sm text-gray-600">
                      {project.description}
                    </p>
                    {project.projectUrl && (
                      <a
                        href={project.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:underline"
                      >
                        访问项目 →
                      </a>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Social Links Card */}
        {profile.socialLinks && profile.socialLinks.length > 0 && (
          <Card className="col-span-2 p-6">
            <h2 className="mb-4 text-xl font-semibold">社交链接</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {profile.socialLinks.map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 rounded-lg border p-4 transition-colors hover:bg-gray-50"
                >
                  {link.platform === "github" && <Github className="h-5 w-5" />}
                  {link.platform === "twitter" && <Twitter className="h-5 w-5" />}
                  {link.platform === "linkedin" && (
                    <Linkedin className="h-5 w-5" />
                  )}
                  {link.platform === "website" && <Globe className="h-5 w-5" />}
                  <span className="capitalize">{link.platform}</span>
                </a>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
