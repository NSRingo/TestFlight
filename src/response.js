import { Console, done, Lodash as _, Storage } from "@nsnanocat/util";
import { URL } from "@nsnanocat/url";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
const FORMAT = ($response.headers?.["Content-Type"] ?? $response.headers?.["content-type"])?.split(";")?.[0];
Console.info(`FORMAT: ${FORMAT}`);
(async () => {
	/**
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("iRingo", "TestFlight", database);
	Console.logLevel = Settings.LogLevel;
	// 创建空数据
	let body = {};
	// 格式判断
	switch (FORMAT) {
		case undefined: // 视为无body
			break;
		case "application/x-www-form-urlencoded":
		case "text/plain":
		default:
			break;
		case "application/x-mpegURL":
		case "application/x-mpegurl":
		case "application/vnd.apple.mpegurl":
		case "audio/mpegurl":
			break;
		case "text/xml":
		case "text/html":
		case "text/plist":
		case "application/xml":
		case "application/plist":
		case "application/x-plist":
			break;
		case "text/vtt":
		case "application/vtt":
			break;
		case "text/json":
		case "application/json":
			body = JSON.parse($response.body ?? "{}");
			// 主机判断
			switch (url.hostname) {
				case "testflight.apple.com":
					// 路径判断
					switch (url.pathname) {
						case "/v1/session/authenticate":
							switch (Settings.MultiAccount) {
								case true: {
									Console.info("启用多账号支持");
									const XRequestId = $request?.headers?.["X-Request-Id"] ?? $request?.headers?.["x-request-id"];
									const XSessionId = $request?.headers?.["X-Session-Id"] ?? $request?.headers?.["x-session-id"];
									const XSessionDigest = $request?.headers?.["X-Session-Digest"] ?? $request?.headers?.["x-session-digest"];
									if (Caches?.data) {
										//有data
										Console.info("有Caches.data");
										if (body?.data?.accountId === Caches?.data?.accountId) {
											// Account ID相等，刷新缓存
											Console.info("Account ID相等，刷新缓存");
											Caches.headers = {
												"X-Request-Id": XRequestId,
												"X-Session-Id": XSessionId,
												"X-Session-Digest": XSessionDigest,
											};
											Caches.data = body.data;
											Caches.data.termsAndConditions = null;
											Caches.data.hasNewTermsAndConditions = false;
											Storage.setItem("@iRingo.TestFlight.Caches", Caches);
										}
									} else {
										// Caches空
										Console.debug("Caches空，写入");
										Caches.headers = {
											"X-Request-Id": XRequestId,
											"X-Session-Id": XSessionId,
											"X-Session-Digest": XSessionDigest,
										};
										Caches.data = body.data;
										Caches.data.termsAndConditions = null;
										Caches.data.hasNewTermsAndConditions = false;
										Storage.setItem("@iRingo.TestFlight.Caches", Caches);
									}
									break;
								}
								case false:
								default:
									break;
							}
							break;
						case "/v1/devices":
						case "/v1/devices/apns":
						case "/v1/devices/add":
						case "/v1/devices/remove":
							break;
						default:
							switch (PATHs[0]) {
								case "v1":
								case "v2":
								case "v3":
									switch (PATHs[1]) {
										case "accounts":
											switch (PATHs[2]) {
												case "settings":
													switch (PATHs[3]) {
														case undefined:
															break;
														case "notifications":
															switch (PATHs[4]) {
																case "apps":
																	break;
															}
															break;
														default:
															break;
													}
													break;
												case Caches?.data?.accountId: // UUID
												default:
													switch (PATHs[3]) {
														case undefined:
															break;
														case "apps":
															switch (PATHs[4]) {
																case undefined:
																	switch (Settings.Universal) {
																		case true:
																		default:
																			Console.info("启用通用应用支持");
																			if (body.error === null) {
																				// 数据无错误
																				Console.debug("数据无错误");
																				body.data = body.data.map(app => {
																					if (app.previouslyTested !== false) {
																						// 不是前测试人员
																						Console.debug("不是前测试人员");
																						app.platforms = app.platforms.map(platform => {
																							platform.build = modBuild(platform.build);
																							return platform;
																						});
																					}
																					return app;
																				});
																			}
																			break;
																		case false:
																			Console.info("启用通用应用支持");
																			break;
																	}
																	break;
																default:
																	switch (PATHs[5]) {
																		case undefined:
																			break;
																		case "builds":
																			switch (PATHs[7]) {
																				case undefined:
																					switch (Settings.Universal) {
																						case true:
																						default:
																							Console.info("启用通用应用支持");
																							if (body.error === null) {
																								// 数据无错误
																								Console.debug("数据无错误");
																								// 当前Bulid
																								body.data.currentBuild = modBuild(body.data.currentBuild);
																								// Build列表
																								body.data.builds = body.data.builds.map(build => modBuild(build));
																							}
																							break;
																						case false:
																							Console.info("关闭通用应用支持");
																							break;
																					}
																					break;
																				case "install":
																					break;
																				default:
																					break;
																			}
																			break;
																		case "platforms":
																			switch (PATHs[6]) {
																				case "ios":
																				case "osx":
																				case "appletvos":
																				default:
																					switch (PATHs[7]) {
																						case undefined:
																							break;
																						case "trains":
																							switch (PATHs[9]) {
																								case undefined:
																									break;
																								case "builds":
																									switch (PATHs[10]) {
																										case undefined:
																											switch (Settings.Universal) {
																												case true:
																												default:
																													Console.info("启用通用应用支持");
																													if (body.error === null) {
																														// 数据无错误
																														Console.debug("数据无错误");
																														// 当前Bulid
																														body.data = body.data.map(data => modBuild(data));
																													}
																													break;
																												case false:
																													Console.info("关闭通用应用支持");
																													break;
																											}
																											break;
																										default:
																											break;
																									}
																									break;
																								default:
																									break;
																							}
																							break;
																						default:
																							break;
																					}
																					break;
																			}
																			break;
																		default:
																			break;
																	}
																	break;
															}
															break;
														case "ru":
															switch (Settings.AlwaysShowInstall) {
																case true:
																	Console.info("总是显示安装选项");
																	switch (body.data?.status) {
																		case "OPEN":
																			break;
																		case "FULL":
																			body.data.status = "OPEN";
																			//body.data.message = "此 Beta 版本的测试员已满。";
																			body.data.app.eligibility = {
																				status: "NO_CRITERIA",
																				criteria: null,
																			};
																			break;
																		case undefined:
																		default:
																			break;
																	}
																	break;
																case false:
																default:
																	Console.info("不显示安装选项");
																	break;
															}
															break;
														default:
															break;
													}
													break;
											}
											break;
										case "apps":
											switch (PATHs[3]) {
												case "install":
													switch (PATHs[4]) {
														case undefined:
															break;
														case "status":
															break;
														default:
															break;
													}
													break;
											}
											break;
										case "messages":
											switch (PATHs[2]) {
												case Caches?.data?.accountId: // UUID
												default:
													switch (PATHs[3]) {
														case undefined:
															break;
														case "read":
															break;
														default:
															break;
													}
													break;
											}
											break;
									}
									break;
							}
							break;
					}
					break;
			}
			$response.body = JSON.stringify(body);
			break;
		case "application/protobuf":
		case "application/x-protobuf":
		case "application/vnd.google.protobuf":
		case "application/grpc":
		case "application/grpc+proto":
		case "application/octet-stream":
			break;
	}
})()
	.catch(e => Console.error(e))
	.finally(() => done($response));

/***************** Function *****************/
/**
 * mod Build
 * @author VirgilClyne
 * @param {Object} build - Build
 * @return {Object}
 */
function modBuild(build) {
	Console.debug(build.platform || build.name);
	switch (build.platform || build.name) {
		case "ios":
			build = Build(build);
			break;
		case "osx":
			if (build?.macBuildCompatibility?.runsOnAppleSilicon === true) {
				// 是苹果芯片
				Console.debug("runsOnAppleSilicon");
				build = Build(build);
			}
			break;
		case "appletvos":
			break;
		default:
			break;
	}
	return build;

	function Build(build) {
		//if (build.universal === true) {
		build.compatible = true;
		build.platformCompatible = true;
		build.hardwareCompatible = true;
		build.osCompatible = true;
		if (build?.permission) build.permission = "install";
		if (build?.deviceFamilyInfo) {
			build.deviceFamilyInfo = [
				{
					number: 1,
					name: "iOS",
					iconUrl: "https://itunesconnect-mr.itunes.apple.com/itc/img/device-icons/device_family_icon_1.png",
				},
				{
					number: 2,
					name: "iPad",
					iconUrl: "https://itunesconnect-mr.itunes.apple.com/itc/img/device-icons/device_family_icon_2.png",
				},
				{
					number: 3,
					name: "Apple TV",
					iconUrl: "https://itunesconnect-mr.itunes.apple.com/itc/img/device-icons/device_family_icon_3.png",
				},
			];
		}
		if (build?.compatibilityData?.compatibleDeviceFamilies) {
			build.compatibilityData.compatibleDeviceFamilies = [
				{
					name: "iPad",
					minimumSupportedDevice: null,
					unsupportedDevices: [],
				},
				{
					name: "iPhone",
					minimumSupportedDevice: null,
					unsupportedDevices: [],
				},
				{
					name: "iPod",
					minimumSupportedDevice: null,
					unsupportedDevices: [],
				},
				{
					name: "Mac",
					minimumSupportedDevice: null,
					unsupportedDevices: [],
				},
			];
		}
		if (build.macBuildCompatibility) {
			build.macBuildCompatibility.runsOnIntel = true;
			build.macBuildCompatibility.runsOnAppleSilicon = true;
			/*
				build.macBuildCompatibility = {
					"macArchitectures": ["AppleSilicon", "Intel"],
					"rosettaCompatible": true,
					"runsOnIntel": true,
					"runsOnAppleSilicon": true,
					"requiresRosetta": false
				};
				*/
		}
		//};
		return build;
	}
}
