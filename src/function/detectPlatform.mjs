import { Console } from "@nsnanocat/util";

export default function detectPlatform(userAgent) {
	Console.log("☑️ Detect Platform");
	/***************** Platform *****************/
	let Platform = "ios";
	switch (true) {
		case /iPhone|iPad|iOS|iPadOS/i.test(userAgent):
            Platform = "ios";
			break;
		case /Macintosh|macOS/i.test(userAgent):
			Platform = "osx";
			break;
        case /Apple TV|tvOS/i.test(userAgent):
            Platform = "appletvos";
            break;
        case /Watch|watchOS/i.test(userAgent):
            Platform = "watchos";
            break;
        case /Vision Pro|xrOS/i.test(userAgent):
            Platform = "xros";
            break;
	}
	Console.log("✅ Detect Platform", `Platform: ${Platform}`);
	return Platform;
}
