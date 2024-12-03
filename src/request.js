import { $app, Console, done, fetch, Lodash as _, notification, Storage, time, wait } from "@nsnanocat/util";
import { URL } from "@nsnanocat/url";
import database from "./function/database.mjs";
import setENV from "./function/setENV.mjs";
// 构造回复数据
let $response = undefined;
Console.debug = () => {};
/***************** Processing *****************/
// 解构URL
const url = new URL($request.url);
Console.info(`url: ${url.toJSON()}`);
// 获取连接参数
const PATHs = url.pathname.split("/").filter(Boolean);
Console.info(`PATHs: ${PATHs}`);
// 解析格式
const FORMAT = ($request.headers?.["Content-Type"] ?? $request.headers?.["content-type"])?.split(";")?.[0];
Console.info(`FORMAT: ${FORMAT}`);
!(async () => {
	/**
	 * @type {{Settings: import('./types').Settings}}
	 */
	const { Settings, Caches, Configs } = setENV("iRingo", "TestFlight", database);
	// 创建空数据
	let body = {};
	// 方法判断
	switch ($request.method) {
		case "POST":
		case "PUT":
		case "PATCH":
		// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
		case "DELETE":
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
					body = JSON.parse($request.body ?? "{}");
					switch (url.hostname) {
						case "testflight.apple.com":
							switch (url.pathname) {
								case "/v1/session/authenticate":
									if (Settings.CountryCode !== "AUTO") body.storeFrontIdentifier = body.storeFrontIdentifier.replace(/\d{6}/, Configs.Storefront[Settings.CountryCode]);
									break;
								case "/v1/properties/testflight":
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
															break;
														case Caches?.data?.accountId: // UUID
														default:
															switch (PATHs[3]) {
																case "apps":
																	switch (PATHs[4]) {
																		default:
																			switch (PATHs[5]) {
																				case "builds":
																					switch (PATHs[7]) {
																						case undefined:
																							break;
																						case "install":
																							if (Settings.CountryCode !== "AUTO") body.storefrontId = body.storefrontId.replace(/\d{6}/, Configs.Storefront[Settings.CountryCode]);
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
											break;
									}
									break;
							}
							break;
					}
					$request.body = JSON.stringify(body);
					break;
				case "application/protobuf":
				case "application/x-protobuf":
				case "application/vnd.google.protobuf":
				case "application/grpc":
				case "application/grpc+proto":
				case "applecation/octet-stream":
					break;
			}
		//break; // 不中断，继续处理URL
		case "GET":
		case "HEAD":
		case "OPTIONS":
		case undefined: // QX牛逼，script-echo-response不返回method
		default:
			// 主机判断
			switch (url.hostname) {
				case "testflight.apple.com":
					// 路径判断
					switch (url.pathname) {
						case "/v1/session/authenticate":
							break;
						case "v1/properties/testflight":
							//$request.headers["X-Apple-Rosetta-Available"] = Settings.Rosetta;
							break;
						case "/v1/devices":
						case "/v1/devices/apns":
						case "/v1/devices/add":
						case "/v1/devices/remove":
							break;
						default:
							// headers auth mod
							switch (Settings.MultiAccount) {
								case true: {
									Console.info("启用多账号支持");
									const IfNoneMatch = $request?.headers?.["If-None-Match"] ?? $request?.headers?.["if-none-match"];
									const XRequestId = $request?.headers?.["X-Request-Id"] ?? $request?.headers?.["x-request-id"];
									const XSessionId = $request?.headers?.["X-Session-Id"] ?? $request?.headers?.["x-session-id"];
									const XSessionDigest = $request?.headers?.["X-Session-Digest"] ?? $request?.headers?.["x-session-digest"];
									if (Caches.data) {
										// Caches.data存在
										Console.info("Caches.data存在，读取");
										switch (PATHs[0]) {
											case "v1":
											case "v2":
											case "v3":
												switch (PATHs[1]) {
													case "accounts":
													case "messages":
													case "apps":
													default:
														switch (PATHs[2]) {
															case "settings":
															case undefined:
															default:
																switch (/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(PATHs[2])) {
																	// biome-ignore lint/suspicious/noFallthroughSwitchClause: <explanation>
																	case true: // PATHs[2]是UUID
																		Console.info("PATHs[2]是UUID，替换url.pathname");
																		url.pathname = url.pathname.replace(/\/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}\//i, `/${Caches.data.accountId}/`);
																	//break; // 不中断，继续处理
																	case false: // PATHs[2]不是UUID
																		if (XSessionId !== Caches.headers["X-Session-Id"]) {
																			// sessionId不同
																			Console.info("sessionId不同，替换$request.headers");
																			if (IfNoneMatch) {
																				delete $request.headers?.["If-None-Match"];
																				delete $request.headers?.["if-none-match"];
																			}
																			if (XRequestId) {
																				if ($request.headers?.["X-Request-Id"]) $request.headers["X-Request-Id"] = Caches.headers["X-Request-Id"];
																				if ($request.headers?.["x-request-id"]) $request.headers["x-request-id"] = Caches.headers["X-Request-Id"];
																			}
																			if (XSessionId) {
																				if ($request.headers?.["X-Session-Id"]) $request.headers["X-Session-Id"] = Caches.headers["X-Session-Id"];
																				if ($request.headers?.["x-session-id"]) $request.headers["x-session-id"] = Caches.headers["X-Session-Id"];
																			}
																			if (XSessionDigest) {
																				if ($request.headers?.["X-Session-Digest"]) $request.headers["X-Session-Digest"] = Caches.headers["X-Session-Digest"];
																				if ($request.headers?.["x-session-digest"]) $request.headers["x-session-digest"] = Caches.headers["X-Session-Digest"];
																			}
																		}
																}
																break;
															case Caches?.data?.accountId: // PATHs[2]有UUID且与accountId相同
																Console.info("PATHs[2]与accountId相同，更新Caches");
																Caches.headers = {
																	"X-Request-Id": XRequestId,
																	"X-Session-Id": XSessionId,
																	"X-Session-Digest": XSessionDigest,
																};
																Storage.setItem("@iRingo.TestFlight.Caches", Caches);
																break;
														}
														break;
													case "tc": // termsAndConditions
														break;
												}
												break;
										}
										break;
									} else {
										// Caches空
										Console.info("Caches空，新写入");
										Caches.headers = {
											"X-Request-Id": XRequestId,
											"X-Session-Id": XSessionId,
											"X-Session-Digest": XSessionDigest,
										};
										if (/[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}/.test(PATHs[2])) {
											Caches.data = {
												accountId: PATHs[2],
												sessionId: XSessionId,
											};
										}
										Storage.setItem("@iRingo.TestFlight.Caches", Caches);
									}
									break;
								}
								case false:
								default:
									break;
							}
							break;
					}
					break;
			}
			break;
		case "CONNECT":
		case "TRACE":
			break;
	}
	$request.url = url.toString();
	Console.debug(`$request.url: ${$request.url}`);
})()
	.catch(e => Console.error(e))
	.finally(() => {
		switch (typeof $response) {
			case "object": // 有构造回复数据，返回构造的回复数据
				//Console.debug("finally", `echo $response: ${JSON.stringify($response, null, 2)}`);
				if ($response.headers?.["Content-Encoding"]) $response.headers["Content-Encoding"] = "identity";
				if ($response.headers?.["content-encoding"]) $response.headers["content-encoding"] = "identity";
				switch ($app) {
					default:
						done({ response: $response });
						break;
					case "Quantumult X":
						if (!$response.status) $response.status = "HTTP/1.1 200 OK";
						delete $response.headers?.["Content-Length"];
						delete $response.headers?.["content-length"];
						delete $response.headers?.["Transfer-Encoding"];
						done($response);
						break;
				}
				break;
			case "undefined": // 无构造回复数据，发送修改的请求数据
				//Console.debug("finally", `$request: ${JSON.stringify($request, null, 2)}`);
				done($request);
				break;
			default:
				Console.error(`不合法的 $response 类型: ${typeof $response}`);
				break;
		}
	});
