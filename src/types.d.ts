export interface Settings {
    /**
     * 国家或地区代码
     *
     * 不同国家或地区提供的内容或有差别。
     *
     * @remarks
     *
     * Possible values:
     * - `'AUTO'` - 🇺🇳自动（跟随地区检测结果）
     * - `'CN'` - 🇨🇳中国大陆
     * - `'HK'` - 🇭🇰香港
     * - `'TW'` - 🇹🇼台湾
     * - `'SG'` - 🇸🇬新加坡
     * - `'US'` - 🇺🇸美国
     * - `'JP'` - 🇯🇵日本
     * - `'AU'` - 🇦🇺澳大利亚
     * - `'GB'` - 🇬🇧英国
     * - `'KR'` - 🇰🇷韩国
     * - `'CA'` - 🇨🇦加拿大
     * - `'IE'` - 🇮🇪爱尔兰
     *
     * @defaultValue "US"
     */
    CountryCode?: 'AUTO' | 'CN' | 'HK' | 'TW' | 'SG' | 'US' | 'JP' | 'AU' | 'GB' | 'KR' | 'CA' | 'IE';
    /**
     * 启用多账号支持
     *
     * 是否启用多账号支持，会自动保存保存更新当前账号信息。
     *
     * @defaultValue false
     */
    MultiAccount?: boolean;
    /**
     * 启用通用应用支持
     *
     * 是否启用通用应用支持，解除 TestFlight app 的 iOS/iPadOS/macOS(AppleSilicon) 平台限制。
     *
     * @defaultValue true
     */
    Universal?: boolean;
    /**
     * [调试] 日志等级
     *
     * 选择脚本日志的输出等级，低于所选等级的日志将全部输出。
     *
     * @remarks
     *
     * Possible values:
     * - `'OFF'` - 关闭
     * - `'ERROR'` - ❌ 错误
     * - `'WARN'` - ⚠️ 警告
     * - `'INFO'` - ℹ️ 信息
     * - `'DEBUG'` - 🅱️ 调试
     * - `'ALL'` - 全部
     *
     * @defaultValue "WARN"
     */
    LogLevel?: 'OFF' | 'ERROR' | 'WARN' | 'INFO' | 'DEBUG' | 'ALL';
}
