// API service for fetching storage device data
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

class StorageApiService {
  constructor() {
    console.log("🔍 Environment variables:", {
      VITE_MOCK_MODE: import.meta.env.VITE_MOCK_MODE,
      VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
      NODE_ENV: import.meta.env.NODE_ENV,
    });

    this.isMockMode = import.meta.env.VITE_MOCK_MODE === "true" || false;
    console.log(
      `🔧 StorageApiService initialized in ${
        this.isMockMode ? "mock" : "API"
      } mode`
    );
    console.log(`🌐 API Base URL: ${API_BASE_URL}`);
  }

  // Toggle between mock and API mode (for testing)
  setMockMode(enabled) {
    this.isMockMode = enabled;
    console.log(`🔄 Mock mode ${enabled ? "enabled" : "disabled"}`);
  }

  // Generic API fetch wrapper
  async fetchFromApi(endpoint, options = {}) {
    try {
      console.log(`📡 Making API request to: ${API_BASE_URL}${endpoint}`);

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          // Remove authorization for local development unless your server requires it
          // Authorization: `Bearer ${import.meta.env.VITE_API_TOKEN}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(`✅ API response received for ${endpoint}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Failed to fetch from ${endpoint}:`, error);
      throw error;
    }
  }

  // Mock data for development
  getMockData() {
    return {
      devices: [
        {
          id: 1,
          name: "BLR-CZ234402KF",
          type: "HPE GreenLake For File Storage",
          deviceScore: 98,
          score: 99,
          greenScore: 98,
          featureScore: 97,
          capacity: "100TB",
          readSpeed: 3500,
          writeSpeed: 3200,
          iops: 120000,
          latency: 0.1,
          throughput: 6800,
          price: 45000,
          sustainability: {
            powerEfficiency: 92,
            carbonReduction: 78,
            circularEconomy: 85,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC", "MFA"],
            },
            availability: ["Auto-failover", "Hot-spare", "RAID"],
            management: ["REST API", "Cloud Integration", "AI Analytics"],
            protocols: ["NFS", "SMB", "REST API"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["NFS", "SMB", "REST API"],
        },
        {
          id: 2,
          name: "BLR-CZ234403MX",
          type: "HPE GreenLake For File Storage",
          deviceScore: 96,
          score: 98,
          greenScore: 96,
          featureScore: 95,
          capacity: "80TB",
          readSpeed: 3200,
          writeSpeed: 2900,
          iops: 110000,
          latency: 0.15,
          throughput: 6200,
          price: 38000,
          sustainability: {
            powerEfficiency: 89,
            carbonReduction: 75,
            circularEconomy: 82,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC"],
            },
            availability: ["Auto-failover", "Hot-spare"],
            management: ["REST API", "Cloud Integration"],
            protocols: ["NFS", "SMB", "iSCSI"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["NFS", "SMB", "iSCSI"],
        },
        {
          id: 3,
          name: "BLR-CZ234404PL",
          type: "HPE GreenLake For File Storage",
          deviceScore: 94,
          score: 96,
          greenScore: 94,
          featureScore: 92,
          capacity: "60TB",
          readSpeed: 2800,
          writeSpeed: 2500,
          iops: 95000,
          latency: 0.2,
          throughput: 5400,
          price: 32000,
          sustainability: {
            powerEfficiency: 85,
            carbonReduction: 72,
            circularEconomy: 78,
          },
          features: {
            dataManagement: {
              deduplication: "Standard",
              compression: "Advanced",
              tiering: "Manual",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC"],
            },
            availability: ["Hot-spare"],
            management: ["REST API"],
            protocols: ["NFS", "SMB"],
          },
          snapshots: "Yes",
          replication: "Optional",
          protocols: ["NFS", "SMB"],
        },
        {
          id: 4,
          name: "BLR-CZ234405RT",
          type: "HPE GreenLake For File Storage",
          deviceScore: 91,
          score: 94,
          greenScore: 92,
          featureScore: 88,
          capacity: "50TB",
          readSpeed: 2400,
          writeSpeed: 2100,
          iops: 80000,
          latency: 0.25,
          throughput: 4800,
          price: 28000,
          sustainability: {
            powerEfficiency: 82,
            carbonReduction: 68,
            circularEconomy: 75,
          },
          features: {
            dataManagement: {
              deduplication: "Standard",
              compression: "Standard",
              tiering: "Manual",
            },
            security: {
              encryption: "AES-128",
              accessControl: ["Basic"],
            },
            availability: ["Hot-spare"],
            management: ["Web UI"],
            protocols: ["NFS", "SMB"],
          },
          snapshots: "Yes",
          replication: "No",
          protocols: ["NFS", "SMB"],
        },
        {
          id: 5,
          name: "BLR-CZ234406WH",
          type: "HPE GreenLake For File Storage",
          deviceScore: 87,
          score: 87,
          greenScore: 89,
          featureScore: 85,
          capacity: "30TB",
          readSpeed: 2000,
          writeSpeed: 1800,
          iops: 65000,
          latency: 0.3,
          throughput: 3600,
          price: 24000,
          sustainability: {
            powerEfficiency: 78,
            carbonReduction: 65,
            circularEconomy: 72,
          },
          features: {
            dataManagement: {
              deduplication: "Basic",
              compression: "Standard",
              tiering: "None",
            },
            security: {
              encryption: "AES-128",
              accessControl: ["Basic"],
            },
            availability: ["Basic"],
            management: ["Web UI"],
            protocols: ["NFS", "SMB"],
          },
          snapshots: "Optional",
          replication: "No",
          protocols: ["NFS", "SMB"],
        },
        {
          id: 6,
          name: "BLR-CZ234407NQ",
          type: "HPE GreenLake For File Storage",
          deviceScore: 79,
          score: 78,
          greenScore: 84,
          featureScore: 75,
          capacity: "20TB",
          readSpeed: 1600,
          writeSpeed: 1400,
          iops: 50000,
          latency: 0.4,
          throughput: 2800,
          price: 18000,
          sustainability: {
            powerEfficiency: 75,
            carbonReduction: 62,
            circularEconomy: 68,
          },
          features: {
            dataManagement: {
              deduplication: "Basic",
              compression: "Basic",
              tiering: "None",
            },
            security: {
              encryption: "Basic",
              accessControl: ["Basic"],
            },
            availability: ["Basic"],
            management: ["Web UI"],
            protocols: ["NFS"],
          },
          snapshots: "No",
          replication: "No",
          protocols: ["NFS"],
        },
        {
          id: 7,
          name: "BLR-CZ234408LK",
          type: "HPE GreenLake For File Storage",
          deviceScore: 78,
          score: 80,
          greenScore: 76,
          featureScore: 74,
          capacity: "24TB",
          readSpeed: 1800,
          writeSpeed: 1600,
          iops: 45000,
          latency: 0.8,
          throughput: 3400,
          price: 18000,
          sustainability: {
            powerEfficiency: 68,
            carbonReduction: 58,
            circularEconomy: 65,
          },
          features: {
            dataManagement: {
              deduplication: "Basic",
              compression: "Standard",
              tiering: "None",
            },
            security: {
              encryption: "Basic",
              accessControl: ["Basic"],
            },
            availability: ["Basic"],
            management: ["Web UI", "SNMP"],
            protocols: ["SMB", "NFS"],
          },
          snapshots: "Limited",
          replication: "No",
          protocols: ["SMB", "NFS"],
        },
        {
          id: 8,
          name: "BLR-CZ234409VB",
          type: "HPE GreenLake For File Storage",
          deviceScore: 88,
          score: 90,
          greenScore: 86,
          featureScore: 84,
          capacity: "45TB",
          readSpeed: 2400,
          writeSpeed: 2100,
          iops: 75000,
          latency: 0.4,
          throughput: 4500,
          price: 28000,
          sustainability: {
            powerEfficiency: 78,
            carbonReduction: 68,
            circularEconomy: 74,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC"],
            },
            availability: ["Hot-spare", "RAID"],
            management: ["REST API", "Web UI"],
            protocols: ["iSCSI", "FC", "NFS"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["iSCSI", "FC", "NFS"],
        },
        {
          id: 9,
          name: "BLR-CZ234410DH",
          type: "HPE GreenLake For File Storage",
          deviceScore: 95,
          score: 97,
          greenScore: 93,
          featureScore: 91,
          capacity: "75TB",
          readSpeed: 3100,
          writeSpeed: 2800,
          iops: 105000,
          latency: 0.12,
          throughput: 5900,
          price: 42000,
          sustainability: {
            powerEfficiency: 88,
            carbonReduction: 73,
            circularEconomy: 81,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC", "MFA"],
            },
            availability: ["Auto-failover", "Hot-spare", "RAID"],
            management: ["REST API", "Cloud Integration"],
            protocols: ["iSCSI", "FC"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["iSCSI", "FC"],
        },
        {
          id: 10,
          name: "BLR-CZ234411FG",
          type: "HPE GreenLake For File Storage",
          deviceScore: 82,
          score: 84,
          greenScore: 80,
          featureScore: 78,
          capacity: "32TB",
          readSpeed: 2200,
          writeSpeed: 1900,
          iops: 65000,
          latency: 0.5,
          throughput: 4100,
          price: 22000,
          sustainability: {
            powerEfficiency: 72,
            carbonReduction: 62,
            circularEconomy: 69,
          },
          features: {
            dataManagement: {
              deduplication: "Standard",
              compression: "Standard",
              tiering: "Manual",
            },
            security: {
              encryption: "AES-128",
              accessControl: ["Basic"],
            },
            availability: ["Hot-spare", "RAID"],
            management: ["Web UI", "CLI"],
            protocols: ["iSCSI", "FC"],
          },
          snapshots: "Yes",
          replication: "Limited",
          protocols: ["iSCSI", "FC"],
        },
        {
          id: 11,
          name: "BLR-CZ234412JY",
          type: "HPE GreenLake For File Storage",
          deviceScore: 86,
          score: 88,
          greenScore: 84,
          featureScore: 82,
          capacity: "96TB",
          readSpeed: 2600,
          writeSpeed: 2300,
          iops: 55000,
          latency: 0.6,
          throughput: 4900,
          price: 35000,
          sustainability: {
            powerEfficiency: 80,
            carbonReduction: 70,
            circularEconomy: 76,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC"],
            },
            availability: ["Redundancy", "Hot-spare"],
            management: ["REST API", "Web UI"],
            protocols: ["NFS", "CIFS", "VTL"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["NFS", "CIFS", "VTL"],
        },
        {
          id: 12,
          name: "BLR-CZ234413QW",
          type: "HPE GreenLake For File Storage",
          deviceScore: 92,
          score: 94,
          greenScore: 90,
          featureScore: 88,
          capacity: "40TB",
          readSpeed: 2900,
          writeSpeed: 2600,
          iops: 85000,
          latency: 0.3,
          throughput: 5500,
          price: 38000,
          sustainability: {
            powerEfficiency: 84,
            carbonReduction: 74,
            circularEconomy: 79,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC"],
            },
            availability: ["Auto-failover", "Triple-parity"],
            management: ["REST API", "Cloud Integration", "AI Analytics"],
            protocols: ["iSCSI", "FC"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["iSCSI", "FC"],
        },
        {
          id: 13,
          name: "BLR-CZ234414ER",
          type: "HPE GreenLake For File Storage",
          deviceScore: 79,
          score: 81,
          greenScore: 77,
          featureScore: 75,
          capacity: "50TB",
          readSpeed: 2000,
          writeSpeed: 1700,
          iops: 50000,
          latency: 0.7,
          throughput: 3700,
          price: 25000,
          sustainability: {
            powerEfficiency: 70,
            carbonReduction: 60,
            circularEconomy: 67,
          },
          features: {
            dataManagement: {
              deduplication: "Standard",
              compression: "Standard",
              tiering: "Manual",
            },
            security: {
              encryption: "AES-128",
              accessControl: ["Basic"],
            },
            availability: ["Network RAID", "Hot-spare"],
            management: ["Web UI", "CLI"],
            protocols: ["iSCSI"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["iSCSI"],
        },
        {
          id: 14,
          name: "BLR-CZ234415TU",
          type: "HPE GreenLake For File Storage",
          deviceScore: 97,
          score: 99,
          greenScore: 95,
          featureScore: 93,
          capacity: "120TB",
          readSpeed: 3400,
          writeSpeed: 3100,
          iops: 115000,
          latency: 0.08,
          throughput: 6500,
          price: 55000,
          sustainability: {
            powerEfficiency: 90,
            carbonReduction: 76,
            circularEconomy: 83,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC", "MFA", "LDAP"],
            },
            availability: ["Auto-failover", "Hot-spare", "RAID", "Multi-site"],
            management: [
              "REST API",
              "Cloud Integration",
              "AI Analytics",
              "SSMC",
            ],
            protocols: ["FC", "iSCSI", "FCoE"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["FC", "iSCSI", "FCoE"],
        },
        {
          id: 15,
          name: "BLR-CZ234416IO",
          type: "HPE GreenLake For File Storage",
          deviceScore: 91,
          score: 93,
          greenScore: 89,
          featureScore: 87,
          capacity: "65TB",
          readSpeed: 2700,
          writeSpeed: 2400,
          iops: 80000,
          latency: 0.25,
          throughput: 5100,
          price: 45000,
          sustainability: {
            powerEfficiency: 82,
            carbonReduction: 72,
            circularEconomy: 78,
          },
          features: {
            dataManagement: {
              deduplication: "Advanced",
              compression: "Advanced",
              tiering: "Automated",
            },
            security: {
              encryption: "AES-256",
              accessControl: ["RBAC", "MFA"],
            },
            availability: ["HA", "DRS", "Hot-spare"],
            management: [
              "vCenter Integration",
              "REST API",
              "Cloud Integration",
            ],
            protocols: ["NFS", "iSCSI", "vSAN"],
          },
          snapshots: "Yes",
          replication: "Yes",
          protocols: ["NFS", "iSCSI", "vSAN"],
        },
      ],
    };
  }

  // Fetch all storage devices with optional sorting
  async getStorageDevices(sortBy = 'deviceScore', sortOrder = 'asc') {
    if (this.isMockMode) {
      console.log("📊 Using mock data for storage devices");
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }

    try {
      const endpoint = `/storage/devices?sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const data = await this.fetchFromApi(endpoint);
      return data.devices || [];
    } catch (error) {
      console.warn("⚠️ Failed to fetch from API, falling back to mock data");
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }
  }

  // Fetch sustainability metrics with optional sorting
  async getSustainabilityMetrics(sortBy = 'greenScore', sortOrder = 'asc') {
    if (this.isMockMode) {
      console.log("🌱 Using mock data for sustainability metrics");
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }

    try {
      const endpoint = `/sustainability/metrics?sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const data = await this.fetchFromApi(endpoint);
      return data.devices || [];
    } catch (error) {
      console.warn(
        "⚠️ Failed to fetch sustainability data, falling back to mock data"
      );
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }
  }

  // Fetch performance metrics with optional sorting
  async getPerformanceMetrics(sortBy = 'score', sortOrder = 'asc') {
    if (this.isMockMode) {
      console.log("⚡ Using mock data for performance metrics");
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }

    try {
      const endpoint = `/performance/metrics?sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const data = await this.fetchFromApi(endpoint);
      return data.devices || [];
    } catch (error) {
      console.warn(
        "⚠️ Failed to fetch performance data, falling back to mock data"
      );
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }
  }

  // Fetch feature comparison data with optional sorting
  async getFeatureComparison(sortBy = 'featureScore', sortOrder = 'asc') {
    if (this.isMockMode) {
      console.log("🔧 Using mock data for feature comparison");
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }

    try {
      const endpoint = `/features/comparison?sortBy=${sortBy}&sortOrder=${sortOrder}`;
      const data = await this.fetchFromApi(endpoint);
      return data.devices || [];
    } catch (error) {
      console.warn(
        "⚠️ Failed to fetch feature data, falling back to mock data"
      );
      const devices = this.getMockData().devices;
      return this.sortDevicesLocally(devices, sortBy, sortOrder);
    }
  }

  // Local sorting function for mock data
  sortDevicesLocally(devices, sortBy, sortOrder) {
    if (!devices || devices.length === 0) return [];
    
    return devices.sort((a, b) => {
      let valueA = a[sortBy];
      let valueB = b[sortBy];

      // Handle different data types
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        valueA = valueA.toLowerCase();
        valueB = valueB.toLowerCase();
        
        if (sortOrder === 'desc') {
          return valueB.localeCompare(valueA);
        } else {
          return valueA.localeCompare(valueB);
        }
      } else {
        // Numeric comparison
        if (sortOrder === 'desc') {
          return valueB - valueA;
        } else {
          return valueA - valueB;
        }
      }
    });
  }

  // Calculate averages from device data
  calculateAverages(devices) {
    if (!devices || devices.length === 0) return {};

    const totals = devices.reduce(
      (acc, device) => {
        acc.deviceScore += device.deviceScore || 0;
        acc.score += device.score || 0;
        acc.greenScore += device.greenScore || 0;
        acc.featureScore += device.featureScore || 0;
        acc.readSpeed += device.readSpeed || 0;
        acc.writeSpeed += device.writeSpeed || 0;
        acc.iops += device.iops || 0;
        acc.latency += device.latency || 0;
        acc.throughput += device.throughput || 0;

        if (device.sustainability) {
          acc.sustainability.powerEfficiency +=
            device.sustainability.powerEfficiency || 0;
          acc.sustainability.carbonReduction +=
            device.sustainability.carbonReduction || 0;
          acc.sustainability.circularEconomy +=
            device.sustainability.circularEconomy || 0;
        }

        return acc;
      },
      {
        deviceScore: 0,
        score: 0,
        greenScore: 0,
        featureScore: 0,
        readSpeed: 0,
        writeSpeed: 0,
        iops: 0,
        latency: 0,
        throughput: 0,
        sustainability: {
          powerEfficiency: 0,
          carbonReduction: 0,
          circularEconomy: 0,
        },
      }
    );

    const count = devices.length;
    return {
      deviceScore: Math.round(totals.deviceScore / count),
      score: Math.round(totals.score / count),
      greenScore: Math.round(totals.greenScore / count),
      featureScore: Math.round(totals.featureScore / count),
      readSpeed: Math.round(totals.readSpeed / count),
      writeSpeed: Math.round(totals.writeSpeed / count),
      iops: Math.round(totals.iops / count),
      latency: Number((totals.latency / count).toFixed(2)),
      throughput: Math.round(totals.throughput / count),
      sustainability: {
        powerEfficiency: Math.round(
          totals.sustainability.powerEfficiency / count
        ),
        carbonReduction: Math.round(
          totals.sustainability.carbonReduction / count
        ),
        circularEconomy: Math.round(
          totals.sustainability.circularEconomy / count
        ),
      },
    };
  }

  // Health check for API connectivity
  async healthCheck() {
    if (this.isMockMode) {
      return { status: "healthy", mode: "mock" };
    }

    try {
      const response = await this.fetchFromApi("/health");
      return { status: "healthy", mode: "api", ...response };
    } catch (error) {
      return { status: "error", mode: "api", error: error.message };
    }
  }
}

// Export as singleton instance
const storageApiService = new StorageApiService();
export default storageApiService;
