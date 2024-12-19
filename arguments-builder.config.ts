import { defineConfig } from "@iringo/arguments-builder";
export default defineConfig({
	output: {
		surge: {
			path: "./dist/iRingo.TestFlight.sgmodule",
			transformEgern: {
				enable: true,
				path: "./dist/iRingo.TestFlight.yaml",
			},
		},
		loon: {
			path: "./dist/iRingo.TestFlight.plugin",
		},
		customItems: [
			{
				path: "./dist/iRingo.TestFlight.snippet",
				template: "./template/quantumultx.handlebars",
			},
			{
				path: "./dist/iRingo.TestFlight.stoverride",
				template: "./template/stash.handlebars",
			},
			{
				path: "./dist/iRingo.TestFlight.srmodule",
				template: "./template/shadowrocket.handlebars",
			},
		],
		dts: {
			isExported: true,
			path: "./src/types.d.ts",
		},
		boxjsSettings: {
			path: "./template/boxjs.settings.json",
			scope: "@iRingo.TestFlight.Settings",
		},
	},
	args: [
		{
			key: "CountryCode",
			name: "国家或地区代码",
			defaultValue: "US",
			type: "string",
			options: [
				{ key: "AUTO", label: "🇺🇳自动（跟随地区检测结果）" },
				{ key: "CN", label: "🇨🇳中国大陆" },
				{ key: "HK", label: "🇭🇰香港" },
				{ key: "TW", label: "🇹🇼台湾" },
				{ key: "SG", label: "🇸🇬新加坡" },
				{ key: "US", label: "🇺🇸美国" },
				{ key: "JP", label: "🇯🇵日本" },
				{ key: "AU", label: "🇦🇺澳大利亚" },
				{ key: "GB", label: "🇬🇧英国" },
				{ key: "KR", label: "🇰🇷韩国" },
				{ key: "CA", label: "🇨🇦加拿大" },
				{ key: "IE", label: "🇮🇪爱尔兰" },
			],
			description: "不同国家或地区提供的内容或有差别。",
		},
		{
			key: "MultiAccount",
			name: "启用多账号支持",
			defaultValue: false,
			type: "boolean",
			description: "启用多账号支持会自动保存保存更新当前账号信息。",
		},
		{
			key: "Universal",
			name: "启用通用应用支持",
			defaultValue: true,
			type: "boolean",
			description: "启用通用应用支持会解除 TestFlight app 的 iOS/iPadOS/macOS(AppleSilicon) 平台限制。",
		},
		{
			key: "AlwaysShowInstall",
			name: "总是显示安装选项",
			defaultValue: false,
			type: "boolean",
			description: "当 Testflight 无法加入时，也总是显示app详情页面的安装选项。",
		},
		{
			key: "LogLevel",
			name: "[调试] 日志等级",
			type: "string",
			defaultValue: "WARN",
			description: "选择脚本日志的输出等级，低于所选等级的日志将全部输出。",
			options: [
				{ key: "OFF", label: "🔴 关闭" },
				{ key: "ERROR", label: "❌ 错误" },
				{ key: "WARN", label: "⚠️ 警告" },
				{ key: "INFO", label: "ℹ️ 信息" },
				{ key: "DEBUG", label: "🅱️ 调试" },
				{ key: "ALL", label: "全部" },
			],
		},
	],
});
