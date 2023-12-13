import React from "react";
import Leaderboard from "./Leaderboard";
import { useValue } from "react-cosmos/client";

export default () => {
  const [state, setstate] = useValue("state", {
    defaultValue: {
      name: "U",
      owner: "9x24zjvs9DA5zAz2DmqBWAg6XcxrrE-8w3EkpwRm4e4",
      ticker: "U",
      balances: {
        "-Pla_1sXIxluyb1aKG32b2RarJfLU6c6E7tSAFRN-vc": 225067,
        "-T_-fPTYe1l8XCJBICMlycLETIWQadgL2j1S5eAaivQ": 5262747,
        "-Tgpu5Oe8Hk3Gc4LMnFiM_A-zzRo7RoYRdjlFHC7B-w": 36,
        "-avKM--PeRAuYghNgYa0MMQLeEtd6EbWvG7EzjIFny0": 25517570,
        "-kV5SKVjW6ixzVsFHRKzzOcxdyPXD_jzI2hnvXv5icw": 5,
        "-ns4YNDgC2GPlj8Oz8sZp_N5gphMcwXDYS54MVtZMNk": 10,
        "-piRzhRGvjxsbNOvKZJn1N96ZbHvlEpKX2omJqidoyk": 4053,
        "-pjeTLQ9AvfsqVD-FagxL1L4o5bPKmGuVYLO-kxzbJk": 51741,
        "-scwz1mjpLt55Y3EVM2Rsuuvq4R0HTV5QxYk-fXcqPI": 606208,
        "-tbRbuQnEdtF45afB1WzvG-_o-5t36RRtZXrS-rwRtw": 294324,
        "-ut5JGuR9_cfkGBCoF1wvfhH-hbCa_9iQ4V-ip42DF8": 32856,
        "-vY79pEocLOi2ONnt-zyCwQk2dN7-fYFklRkK7aejhU": 981161,
        "-xUKabRLFa0MSVzyhvm05SZIdS1dmp3zJ2WbjSZuJ-E": 46,
        "0000000000000000000000000000000000000000000": 10000000,
        "05tonNFuOFXVUl0PcSBhhiD_M88ez8QpPDlnlr0QlNA": 1049,
        "05zvg9qEyjjI8KXzms7Ym4PdRGG9v46eUyfRuHHyrFM": 0,
        "06ZZucTGwIQoQulTa6eP9hhPmf4APnDUo_1xvSu1R3k": 5907,
        "0Amw-Ha8fvPbEahV_G8t0a0VauwejXZDNJ1cXUfQxBo": 25517570,
        "0BETFhyVfiCeL0RIiDafI5eoMILUXhdv2vsQVf0YUXs": 927,
        "0FBJ_DLEb8dQYicUOvw4yUBmLGyDvOkzsK9XYLVWNLc": 912,
        "0II7eYYkRxFT3DhtTeqczwWWnSFupZvFWJWSmw0WpCU": 10632,
        "0IUi0sZVyQVxyYcM1Z1p9zZ0J2uKWKFjVzPiy99vPq0": 25517570,
        "0IWZuGzywT_APhsa3LhQdZczfpeJEFHRdoTOuQk30uQ": 90,
        "0IciRazT1YsnxR-H_I30HbZYetXqF-AFXhxuU2w_OrE": 25517570,
      },
      settings: [
        ["isTradeable", true],
        ["communityLogo", "J3WXX4OGa6wP5E9oLhNyqlN4deYI7ARjrd5se740ftE"],
      ],
      claimable: [
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 50000,
          from: "HnKoL7ftH0BU3eUveKayuLpKu0XPnRehgBPu1GitZsQ",
          txID: "vZ0I7ALq5EveXI78XFaWlF_aG6RmhF9GVCmgpMXMkHM",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 100000,
          from: "HnKoL7ftH0BU3eUveKayuLpKu0XPnRehgBPu1GitZsQ",
          txID: "-xOl7dIjvgLrx3WpH7C5ROxZi-Ju5XGgIp4KWcTWoDQ",
        },
        {
          to: "D5P4E2qSfgPx-gReIasfx6OkgRt_2W5EdaziBDCtmAQ",
          qty: 20000,
          from: "jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M",
          txID: "G_hQWrCtznrcD-rJWHmRkTHjNSsPyJgNtntztyWBlIA",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 300000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "q5Ou56S4MnTEiB4S9j936YEFPF6Vcg2rKA58BQCa_AU",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 100000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "geb057-7k1LxQx6sTCUGpHrVwVp2hHchN5NJHnN98aw",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 150000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "w_6BJqvDL1ygqJukRHGPlWyV3sMooR6BYwSqtpQG-9E",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 50000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "samUOCsh1SPkuA9uwpEOB5tZmNM3omn8UgBieNvtOQU",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 100000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "jTSBYOxLEX379e49KGhxvBtCVWbiElsLAuZLhOWmPXI",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "oSAmvkhWzLrU5p8raAGlCiswekYpmdthE75sncljWZ0",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 20000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "XW4zOYuVoJsz0URDPmISenUstSmE-ENOjnGNDZb0Kpg",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 16500,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "e3j51gLG5OXnf8STZpLJ9LEqtDG11-Z4GUylhmF4Epg",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 20000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "fxqldUcuNjrHYXrIW6Qpc6p6vnP4a0QuB0i25hSnQIk",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 100000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "DqbwDGeLsdrAWs8y74Fgv7ttEIVMtSTkDj7p4Ar0kgw",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "GUFPSIh1lZddFjcSwKknIfIslRD9gMhDVGu-ckmFISw",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "IFyzB7HeSdEmh2G4r5A7mSOoFPBxI_gM9h65YeNLaHQ",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "zZzsF066F8hNV29Y0LmITvgxezKfu4gpPj3MCHbhvpU",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "0rRpMQyS0AVGFfEPDRKqq4l69NepaEIMw7ILiJw-394",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "BDn4ul7U5QNuXyqM3ccD-8srWFX7euXT2PWv88PGzXM",
        },
        {
          to: "nqLzzUFCL374bgl_wYJP1QcJPbR31kBuleVfOR2XxY4",
          qty: 20000,
          from: "jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M",
          txID: "lhhf-1401d_skXmzCVUlpC0YG1lyViir4hbgIOrWO-o",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "egX36u6I_7fob2rVwdJHcQYMVPHQnlo2FM2IZ6HKcMI",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 20000,
          from: "gskFtWPsLkJwBvMK2bRE7FTGHmxrMsaU_MTw56n-RIE",
          txID: "jUHcU0TS6_TgjcIz2R2AknbuTr7hHh02rztz-GzgiY0",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "XOXxc-49xz_ElNmMed58mmEn-rn-yFEDYhEsDsPKAwg",
          txID: "8dn8id40m4g32g8tu0Jshz4XqGFnMH3Ff9nQmq3Qxck",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "jnioZFibZSCcV8o-HkBXYPYEYNib4tqfexP0kCBXX_M",
          txID: "4VKryrn_loSOEXxtCCxMCPypLyRVFka9PIbTq-bRY2k",
        },
        {
          to: "XW_z0WhM5PsVD-nmyNm1pCK1za9uysu1vco1HS8DpIo",
          qty: 10000,
          from: "EO54_9d715SEqSXxx-nNsXqMyRgqyrYNIqb_OXSxSXA",
          txID: "jkDJ3dZHJrTIxuc-n6smXxgPpXWEjNL5QG4xRJg3Alc",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 20000,
          from: "vu3GICa6cX2SJsKCG-1wtUOCtTqRvRetVXSwoD8cykQ",
          txID: "5EpzVNBfWN-FjChzoHNb53ihvM3QdfPcR6T2C3SxCMs",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 50000,
          from: "hv4NIWngChaX8TkmyTdRS9CW1gquds3u9NlVoU9W9KM",
          txID: "i8TCakErhoViSLUkmeuxNx2e_qVPIVMMiifERoi8akQ",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 11000,
          from: "7nrFkEAaGVMhQ2tP_mA4-5uXXVKOkKmpcs-Qa1LJHEY",
          txID: "qk-CZmYD4EJBhDRCUZkkO51jkTdoKIoVVB8joTEAAw0",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 58000,
          from: "h7wP8NjoGkJTdLXC6kwS6fLTNgfeYbZr9YoED5NFQX0",
          txID: "qVysKhIUQMfl2Pn7pcw-eET4M0qijMKSfYTUe6E4CxA",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 55000,
          from: "DSDXCgoDM0iLjr3aUhDM9IAtiP2N0reHiCw-ACCBNdA",
          txID: "8U3Ea7ro9VWJfm7hV95RyJMqv7aKBAgxYB43GmPMf6k",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 90000,
          from: "DSDXCgoDM0iLjr3aUhDM9IAtiP2N0reHiCw-ACCBNdA",
          txID: "kk4KZ7vLOABOGekrEy6VL3SjjXng0UCPvp430HTmgpI",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 50000,
          from: "DSDXCgoDM0iLjr3aUhDM9IAtiP2N0reHiCw-ACCBNdA",
          txID: "HMgUnHjBQIpvNH0Z2ZvjCZ--_ky8jd-nZWJEG8CHsIM",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 80000,
          from: "h7wP8NjoGkJTdLXC6kwS6fLTNgfeYbZr9YoED5NFQX0",
          txID: "AabJBzxQ29oLF25Dm5Mk499-eNZVo1Tlx8cVfNScDhU",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 80000,
          from: "QAUKiuTTpVQ0Ozk4bUG69GdAY1mQP2xpGChQr68clWY",
          txID: "F7RtFOIyWtSz4RaNP86_9tX3Ica0upwNp8aPv8EATpY",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 1666000,
          from: "QAUKiuTTpVQ0Ozk4bUG69GdAY1mQP2xpGChQr68clWY",
          txID: "NTSnyVom_EEca5UQ7KmQPxxiyIrPxpUdk3Vbl_n1NnI",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 60000,
          from: "DSDXCgoDM0iLjr3aUhDM9IAtiP2N0reHiCw-ACCBNdA",
          txID: "H_qd_4LF2yeA8YG5idS_RsFYMWiGwsIPsx-skDqZTnU",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 500,
          from: "h7wP8NjoGkJTdLXC6kwS6fLTNgfeYbZr9YoED5NFQX0",
          txID: "q6jfr6cV8hDpb-I14v1x0kKKClUlmnt2ijQ2uv4dElg",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 500,
          from: "RuTIDufB8DNJCGU7-B4nUwMvcvYDnwjS0s8Vc6JBLfQ",
          txID: "p0v44NDg376CzMHpYkvdFBJsFolpRh4S8TLgTnXvO5Q",
        },
        {
          to: "tfalT8Z-88riNtoXdF5ldaBtmsfcSmbMqWLh2DHJIbg",
          qty: 500,
          from: "vu3GICa6cX2SJsKCG-1wtUOCtTqRvRetVXSwoD8cykQ",
          txID: "G0y_G1QdSkhMAhXO9o7A3w5OU9hvwZVdM9erKI5gFrA",
        },
      ],
      divisibility: 1000000,
      sortKey:
        "000001302258,0000000000000,994437ff8e812b6cbacadb861a4b59a25d0bae9462f65aafc129be23e5242ce9",
    },
  });

  return <Leaderboard state={state} />;
};