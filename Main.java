import java.time.Instant;

class Main{
    static long getTimestamp(){
        return Instant.now().toEpochMilli();
    }

    public static void main(String[] args){
        OpenSimplexNoise osn = new OpenSimplexNoise();

        //System.out.println(osn.eval(2.5,2.5));

        long rounds = (long)1e8;
        int quant = 1;
        long start = Main.getTimestamp();
        
        for(int i = 0; i < rounds; i++){
            // osn.eval(2.5, 2.5);
            osn.eval(-4.5, 2.5);
            // osn.eval(0, 500);
        }

        long end = Main.getTimestamp();

        long duration = end-start;
        long calls = rounds * quant;
        long opssec = calls * 1000 / duration;
        System.out.format("it took %dms for %,d runs ~ %,d ops/sec", duration, calls, opssec);
    }
}