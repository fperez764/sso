const modemSchema = {
    id: {
        domainId: 94,
        name: '{{name}}',
    },
    description: 'Terminal pre-provisionada',
    type: 'MDM2210-Wifi',
    macAddress: '{{mac}}',
    locked: false,
    monitoringType: 'Standard',
    monitoringOption: null,
    returnClassificationProfileId: {
        domainId: 7,
        domainName: 'hno',
        name: 'SUBE',
        systemId: 617,
    },
    serviceProfileId: {
        domainId: 94,
        domainName: 'ABEvno',
        name: 'PreProvision',
        systemId: 774,
    },
    attachment: {
        type: 'CPM_CAPACITY',
        forwardPoolId: {
            domainId: 7,
            domainName: 'hno',
            name: 'ABE-B01-SN1-Pool-1',
            systemId: 110,
        },
        returnPoolId: {
            domainId: 7,
            domainName: 'hno',
            name: 'RCP-ABE-1-TB',
            systemId: 446,
        },
        returnTechnology: 'CPM',
        satelliteNetworkId: {
            domainId: 7,
            domainName: 'hno',
            name: 'ABE-B01-SN1',
            systemId: 45,
        },
    },
    attributes: {},
    networkConfigurations: [
        {
            type: 'SHARED',
            serviceLabel: null,
            vlanTag: null,
            segment4RemoteManagement: {
                managed: true,
                ipv4Napt: {
                    enabled: true,
                    portForwardingRules: [],
                    lanAddress: '192.168.0.1',
                    lanPrefixLength: 24,
                },
                forwardIpv4FirewallProfileId: null,
                forwardIpv6FirewallProfileId: null,
            },
            ipv4Template: {
                disabled: false,
                serviceLabel: 'ABE-OSPF-VRF-1',
            },
            ipv6Template: {
                disabled: true,
            },
            inValid: false,
        },
    ],
    routeAdvertisementSettings: {
        mode: 'Static',
    },
    lineUpSettings: {
        nominalBandwidthHz: 128000,
        nominalOutputPowerDbm: 33,
        outputPower1DbCompression: 33,
        txPsdControlMode: 'Login Only',
    },
    aupcEnabled: false,
    aupcRange: 6,
    powerSettings: {
        outputPowerDbm: 25,
        powerControlMode: 'Nominal',
        outputPowerType: 'ODU_POWER',
    },
    multicastCircuits: [],
    softwareUpdateGroup: 3,
    bucSettings: {
        bucAndModemFrequencySynchronized: true,
        bucMaxFrequencyUncertainty: 1,
    },
    beamRoamingEnabled: false,
    communicationsOnTheMove: {
        enabled: false,
        maximumSpeed: 0,
        maximumAcceleration: 0,
    },
    skipCertification: true,
    positionTimeout: 60000,
    switchTimeout: 60000,
    returnTechnology: 'CPM',
    forwardClassificationProfileId: {
        domainId: 7,
        domainName: 'hno',
        name: 'SUBE',
        systemId: 617,
    },
    wifiSettings: {
        managed: true,
        enabled: true,
        channel: '0',
        wifiBand: {
            txPower: 29,
            accessPoint: {
                wps: true,
                ssid: 'ABE',
                wifiEncryption: {
                    encryptionType: 'WPA',
                    wpaEncryptionType: 'WPA2',
                    wpaCipher: 'TKIP + CCMP',
                    encryptionKey: 'Telepuerto',
                },
            },
            channel: '0',
        },
        countryCode: 'Bolivia',
    },
};

module.exports = modemSchema;
