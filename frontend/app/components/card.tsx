import { dashboardCards } from "@/public/imagesCard";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  Grid
} from "@mui/material";


const DashboardCardSection = () => {
  return (
   
    <Box sx={{ px: 2, mt: 4 }} width="100%">
      <Grid container spacing={2}  sx={{display:"flex", justifyContent:"space-evenly"}}
      //  xs={12} sm={9} md={6}
       >
        {dashboardCards.map((card, index) => (
          <Grid key={index}>
            <Card
              sx={{
                width:"100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
              }}
              elevation={4}
            >
              <CardContent sx={{ pb: 1 }}>
                <Typography fontWeight={700} fontSize={18}>
                  {card.title}
                </Typography>
              </CardContent>

              {card.images && (
                <CardContent sx={{ pt: 0 }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(2, 1fr)",
                      gap: 1,
                    }}
                  >
                    {card.images.map((img, i) => (
                      <CardMedia
                        key={i}
                        component="img"
                        image={img}
                        alt=""
                        sx={{
                          height: 110,
                          objectFit: "cover",
                        }}
                      />
                    ))}
                  </Box>
                </CardContent>
              )}

              {card.image && (
                <CardMedia
                  component="img"
                  image={card.image}
                  alt=""
                  sx={{
                    height: 220,
                    objectFit: "cover",
                    mx: 2,
                  }}
                />
              )}

              <Box sx={{ flexGrow: 1 }} />

              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  size="small"
                  sx={{
                    color: "#007185",
                    textTransform: "none",
                    p: 0,
                    fontSize: 14,
                    "&:hover": {
                      backgroundColor: "transparent",
                      textDecoration: "underline",
                    },
                  }}
                >
                  {card.linkText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DashboardCardSection;
