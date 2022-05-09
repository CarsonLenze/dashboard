const si = require("systeminformation");
let StaticInfo;
const CONFIG = null;

export default async function Info(req, res) {
    if (!StaticInfo) {
        const [osInfo, cpuInfo, memInfo, memLayout, diskLayout] = await Promise.all(
            [si.osInfo(), si.cpu(), si.mem(), si.memLayout(), si.diskLayout()]
        );

        const os = {
            arch: osInfo.arch,
            distro: osInfo.distro,
            kernel: osInfo.kernel,
            platform: osInfo.platform,
            release: osInfo.release,
            uptime: 0,
        };

        const cpu = {
            brand: cpuInfo.manufacturer,
            model: cpuInfo.brand
                .replace(/Processor/g, "")
                .replace(/[A-Za-z0-9]*-Core/g, "")
                .trim(),
            cores: cpuInfo.physicalCores,
            threads: cpuInfo.cores,
            frequency: cpuInfo.speed,
        };

        const ram = {
            size: memInfo.total,
            layout: memLayout.map(({ manufacturer, type, clockSpeed }) => ({
                brand: manufacturer,
                type: type,
                frequency: clockSpeed ?? undefined,
            })),
        };

        const storage = {
            layout: diskLayout.map(({ size, type, vendor }) => ({
                brand: vendor,
                size,
                type,
            })),
        };

        StaticInfo = { os, cpu, ram, storage };
    }

    res.status(200).json({ ...StaticInfo, os: { ...StaticInfo.os, uptime: +si.time().uptime }, config: CONFIG });
}
