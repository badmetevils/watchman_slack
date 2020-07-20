/**
 *  if  ACT_TS in wh
 *       find LAST_AW_TS
 *            if LAST_AW_TS  in wh
 *                  away_time_wh =  LAST_AW_TS to ACT_TS
 *            is LAST_AW_TS in nh1
 *                  away_time_wh = start_time to ACT_TS
 *
 * if ACT_TS in NWH
 *       if ACT_TS in NH1  log them
 *        is ACT_TS in NH2
 *            LAST_AW_TS  IN NH1
 *                    AWAY_TIME_WH = START TO END
 *             LAST_AW_TS IN WH
 *                     AWAY_TIME_WH = LAST_AW TO END
 *
 */
