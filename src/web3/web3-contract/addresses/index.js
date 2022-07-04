const BSC_TESTNET = {
    ERC20: {
        "0x238133bDCC516f93a3343E899B20Bc12aD80b4D5":{
            img: "./bundau.png"
        },
        "0x030BD3C0fAD97753eA267Cc054016460fD3628Fe":{
            img: "./bundau.png"
        },
        "0x9c6f64229F3794Fb8D2eBd487d192f02057d595d":{
            img: "./bundau.png"
        },
        "0x4e59314de8d0679a92e2290FDD2b9Ce460D6B52d":{
            img: "./bundau.png"
        },
        "0x6B23fa7B147f83839F1b15993523774608a6fdbB":{
            img: "./bundau.png"
        },
        "0x9aAB17c81151eEc06b6359c84d2841B6B35e95A3":{
            img: "./bundau.png"
        },
        "0x7EC267259eEB7E51Ad25aC74f431bfeE501fEFF4":{
            img: "./bundau.png"
        },
        "0xCED518655A1B323A870BeE734D8501258027d7BB":{
            img: "./bundau.png"
        },
        "0x2438e01f02bcA86d0520fd5E5F3406002247c9a9":{
            img: "./bundau.png"
        },
        "0x975db1f0741CaA192ce7eC4E13afbeD72418B704":{
            img: "./bundau.png"
        }
    },
    BND : {
        address: "0x1Cb6cBAAeAB19066eE8dA3E6F7734667BB4dc258",
        img: "./bundau.png"
    },
    factory: "0xAF770c8E17eEeF29c531d02Cd666a843323Cf381",
    farming: "0x6371159a16f8Ec56C4DcCD304b9a66ed6633B1dd",
    multicall: "0xae11C5B5f29A6a25e955F0CB8ddCc416f522AF5C"
}

const FTM_TESTNET = {
    ERC20: {
        "0x4A8E25e23fba8d2D7794e7437745375F137E3314":{
            img: "./bundau.png"
        },
        "0x505B3314dAe47cCcb12E39140B092C91640Deac5":{
            img: "./bundau.png"
        },
        "0xF5C0B7dE8f099Ee08fA809131cF8E4493c94D28f":{
            img: "./bundau.png"
        },
        "0xBcc7E6d3D5CdB9a11CDcec9214A9bA85a488e50E":{
            img: "./bundau.png"
        },
        "0x58f2868f229224f19562b44d59e7eE0F5e6A3454":{
            img: "./bundau.png"
        },
        "0x98B01d9b339bFecd684dc11FbA90f6Bdce7fC49D":{
            img: "./bundau.png"
        },
        "0x7ee72149a3ed452302331F9228B1580EC3976b8D":{
            img: "./bundau.png"
        },
        "0x40B253c44e64f903F16F8dCf35226c4Ea4819467":{
            img: "./bundau.png"
        },
        "0x9602EdF9750aDC3C118c49b8F4e28f53C09cC212":{
            img: "./bundau.png"
        },
        "0x8359C1c0f56AD44aecB3215411Ba82E722A7936e":{
            img: "./bundau.png"
        }
    },
    BND : {
        address: "0xCED518655A1B323A870BeE734D8501258027d7BB",
        img: "./bundau.png"
    },
    multicall: "0xa9f8D90Fbc300A384Ad2732B56F559E525f9DDd7",
    factory: "0xeBb1174Fec39CAb39De22d7e3959E3e51B0eF450",
    farming: "0x825FDb73a64046ffCDDe0aa900317E8954f20851",
    timelock: "0xA2Cde86Cd71e69FcCE718A88803AF1388A0bd449",
    vote: "0x8ecAFbC8a3C19a3FAcaD927aD0314909D1AB6928"
}

export const Addresses = {
    [97]: BSC_TESTNET,
    [4002]: FTM_TESTNET,
    default: FTM_TESTNET
}

export const getContractAddress = (chainId, contractName) => {
    if(!Addresses[chainId]) return;
    return Addresses[chainId][contractName]
}